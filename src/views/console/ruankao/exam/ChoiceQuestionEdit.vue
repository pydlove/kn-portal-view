<!-- src/views/console/exam/components/ChoiceQuestionEdit.vue -->
<template>
  <a-form
    :model="formState"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    ref="formRef"
  >
    <a-form-item
      label="题目内容"
      name="title"
      :rules="[{ required: true, message: '请输入题目内容' }]"
    >
      <a-textarea
        v-model:value="formState.title"
        placeholder="请输入题目内容"
        :auto-size="{ minRows: 3, maxRows: 6 }"
      />
      <div class="toolbar-buttons" style="margin-top: 5px;">
        <a-button size="small" @click="insertMarkdownTemplate('analysis', 'red')">红色文字</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('analysis', 'bold')" style="margin-left: 8px">粗体</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('analysis', 'code')" style="margin-left: 8px">代码</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('analysis', 'image')" style="margin-left: 5px">图片</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('analysis', 'hdck')" style="margin-left: 5px">回答此空</a-button>
      </div>
    </a-form-item>

    <a-form-item
      label="难度等级"
      name="difficulty"
      :rules="[{ required: true, message: '请选择难度等级' }]"
    >
      <a-select v-model:value="formState.difficulty"
                placeholder="请选择难度等级">
        <a-select-option :value="1">简单</a-select-option>
        <a-select-option :value="2">中等</a-select-option>
        <a-select-option :value="3">困难</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      label="题目分数"
      name="score"
      :rules="[{ required: true, message: '请输入题目分数' }]"
    >
      <a-input-number
        v-model:value="formState.score"
        placeholder="请输入题目分数"
        :min="0"
        :step="0.5"
      />
    </a-form-item>

    <a-form-item
      label="选择题类型"
      name="choiceType"
      :rules="[{ required: true, message: '请选择选择题类型' }]"
    >
      <a-radio-group v-model:value="formState.choiceType">
        <a-radio :value="1">单选题</a-radio>
        <a-radio :value="2">多选题</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item
      label="选项"
      :required="true"
    >
      <div v-for="(option, index) in options" :key="index"
           class="option-item">
        <a-input-group compact>
          <a-input
            v-model:value="option.label"
            placeholder="选项标签（如A、B、C...）"
            style="width: 20%"
          />
          <a-input
            v-model:value="option.content"
            placeholder="选项内容"
            style="width: 70%; margin-left: 10px"
          />
          <a-button
            @click="removeOption(index)"
            style="margin-left: 10px"
          >
            删除
          </a-button>
        </a-input-group>
      </div>
      <a-button @click="addOption" style="margin-top: 10px">添加选项
      </a-button>
    </a-form-item>

    <a-form-item
      label="正确答案"
      name="correctAnswers"
      :rules="[{ required: true, message: '请选择正确答案' }]"
    >
      <div v-if="formState.choiceType === 1">
        <!-- 单选题 -->
        <a-radio-group v-model:value="formState.correctAnswers">
          <a-radio
            v-for="(option, index) in options"
            :key="index"
            :value="option.label"
          >
            {{ option.label }}
          </a-radio>
        </a-radio-group>
      </div>
      <div v-else>
        <!-- 多选题 -->
        <a-checkbox-group v-model:value="selectedAnswers">
          <a-row>
            <a-col
              v-for="(option, index) in options"
              :key="index"
              :span="12"
            >
              <a-checkbox :value="option.label">{{ option.label }}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </div>
    </a-form-item>

    <a-form-item
      label="答案解析"
      name="analysis"
    >
      <a-textarea
        v-model:value="formState.analysis"
        placeholder="请输入答案解析"
        :auto-size="{ minRows: 3, maxRows: 6 }"
      />
      <div class="toolbar-buttons" style="margin-top: 5px;">
        <a-button size="small" @click="insertMarkdownTemplate('analysis', 'red')">红色文字</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('analysis', 'bold')" style="margin-left: 8px">粗体</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('analysis', 'code')" style="margin-left: 8px">代码</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('analysis', 'image')" style="margin-left: 5px">图片</a-button>
      </div>
    </a-form-item>

    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="handleSubmit"
                :loading="confirmLoading">提交
      </a-button>
      <a-button style="margin-left: 10px" @click="onCancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { getQuestion, getChoiceDetail, updateQuestion, updateChoiceDetail } from '@/api/ruankao/exam/exam.ts';

interface Option {
  label: string;
  content: string;
}

const props = defineProps<{
  questionId: string;
}>();

const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'cancel'): void;
}>();

const formRef = ref();
const confirmLoading = ref(false);
const labelCol = { span: 4 };
const wrapperCol = { span: 14 };

const formState = reactive({
  title: '',
  difficulty: undefined as number | undefined,
  score: undefined as number | undefined,
  type: 'CHOICE',
  choiceType: 1,
  correctAnswers: '',
  analysis: ''
});

const options = ref<Option[]>([
  { label: 'A', content: '' },
  { label: 'B', content: '' },
  { label: 'C', content: '' },
  { label: 'D', content: '' }
]);

const selectedAnswers = ref<string[]>([]);

// 添加插入 Markdown 模板的方法
const insertMarkdownTemplate = (field: string, indexOrStyle: any, style?: string) => {
  let template = '';

  // 确定要插入的模板
  if (field === 'title' || field === 'analysis') {
    switch (indexOrStyle) {
      case 'red':
        template = "<span style='color:red'>重要文字</span>";
        break;
      case 'bold':
        template = "**粗体文字**";
        break;
      case 'code':
        template = "`代码片段`";
        break;
      case 'image':
        template = "![图片描述](图片链接)";
        break;
      case 'hdck':
        template = "（回答此空）";
        break;
    }
  } else if (field === 'option') {
    const index = indexOrStyle;
    switch (style) {
      case 'red':
        template = "<span style='color:red'>重要文字</span>";
        break;
      case 'bold':
        template = "**粗体文字**";
        break;
      case 'code':
        template = "`代码片段`";
        break;
    }

    // 插入到指定选项
    if (template) {
      const currentContent = options.value[index].content;
      options.value[index].content = currentContent + (currentContent ? ' ' : '') + template;
    }
    return;
  }

  // 插入到指定字段
  if (template) {
    if (field === 'title') {
      const currentTitle = formState.title;
      formState.title = currentTitle + (currentTitle ? ' ' : '') + template;
    } else if (field === 'analysis') {
      const currentAnalysis = formState.analysis;
      formState.analysis = currentAnalysis + (currentAnalysis ? ' ' : '') + template;
    }
  }
};

const addOption = () => {
  const nextLabel = String.fromCharCode(65 + options.value.length);
  options.value.push({ label: nextLabel, content: '' });
};

const removeOption = (index: number) => {
  if (options.value.length <= 2) {
    message.warning('至少需要两个选项');
    return;
  }
  options.value.splice(index, 1);
};

const fetchDetail = async () => {
  try {
    const [question, choiceDetail] = await Promise.all([
      getQuestion(Number(props.questionId)),
      getChoiceDetail(Number(props.questionId))
    ]);

    // 设置题目基本信息
    formState.title = question.title;
    formState.difficulty = question.difficulty;
    formState.score = question.score;
    formState.type = question.type;

    // 设置选择题详情
    formState.choiceType = choiceDetail.choiceType;
    formState.correctAnswers = choiceDetail.correctAnswers;
    formState.analysis = choiceDetail.analysis;

    // 设置选项
    if (choiceDetail.options) {
      options.value = Array.isArray(choiceDetail.options)
        ? choiceDetail.options
        : JSON.parse(choiceDetail.options as string);
    }

    // 设置正确答案
    if (choiceDetail.choiceType === 2) {
      selectedAnswers.value = choiceDetail.correctAnswers
        ? choiceDetail.correctAnswers.split(',')
        : [];
    } else {
      formState.correctAnswers = choiceDetail.correctAnswers || '';
    }
  } catch (error) {
    console.error('获取选择题详情失败', error);
    message.error('获取选择题详情失败');
  }
};

const handleSubmit = async () => {
  confirmLoading.value = true;
  try {
    // 表单验证
    await formRef.value.validate();

    // 检查选项内容是否填写完整
    const emptyOptions = options.value.filter(opt => !opt.content.trim());
    if (emptyOptions.length > 0) {
      message.error('请填写所有选项内容');
      throw new Error('选项内容不完整');
    }

    // 检查是否有正确答案
    if (formState.choiceType === 1 && !formState.correctAnswers) {
      message.error('请选择正确答案');
      throw new Error('未选择正确答案');
    }

    if (formState.choiceType === 2 && selectedAnswers.value.length === 0) {
      message.error('请选择正确答案');
      throw new Error('未选择正确答案');
    }

    // 构造提交数据
    const questionData = {
      id: Number(props.questionId),
      title: formState.title,
      difficulty: formState.difficulty,
      score: formState.score,
      type: formState.type
    };

    const choiceData = {
      id: Number(props.id),
      questionId: Number(props.questionId),
      choiceType: formState.choiceType,
      correctAnswers: formState.choiceType === 1
        ? formState.correctAnswers
        : selectedAnswers.value.join(','),
      analysis: formState.analysis,
      options: JSON.stringify(options.value)
    };

    // 提交数据
    await Promise.all([
      updateQuestion(Number(props.questionId), questionData),
      updateChoiceDetail(Number(props.questionId), choiceData)
    ]);

    message.success('更新选择题成功');
    emit('submit');
  } catch (error: any) {
    if (error?.errorFields) {
      // 表单验证失败
      console.log('表单验证失败');
    } else {
      console.error('更新选择题失败', error);
      message.error('更新选择题失败');
    }
  } finally {
    confirmLoading.value = false;
  }
};

const onCancel = () => {
  emit('cancel');
};

defineExpose({
  fetchDetail
});

onMounted(() => {
  fetchDetail();
});
</script>

<style scoped>
.option-item {
  margin-bottom: 10px;
}
</style>
