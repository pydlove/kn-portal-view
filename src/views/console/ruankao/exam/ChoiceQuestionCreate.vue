<!-- src/views/console/exam/components/ChoiceQuestionCreate.vue -->
<template>
  <a-form
    :model="formState"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    ref="formRef"
  >
    <!-- 题目内容 -->
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
        <a-button size="small" @click="insertMarkdownTemplate('title', 'red', formState)">红色文字</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('title', 'bold', formState)" style="margin-left: 8px">粗体</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('title', 'code', formState)" style="margin-left: 8px">代码</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('title', 'image', formState)" style="margin-left: 5px">图片</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('title', 'hdck', formState)" style="margin-left: 5px">回答此空</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('title', 'hdck1', formState)" style="margin-left: 5px">回答此空1</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('title', 'hdck2', formState)" style="margin-left: 5px">回答此空2</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('title', 'hdck3', formState)" style="margin-left: 5px">回答此空3</a-button>
      </div>
    </a-form-item>

    <a-form-item
      label="文章分类"
      name="categoryName"
      :rules="[{ required: true, message: '请输入文章分类' }]"
    >
      <a-input v-model:value="formState.categoryName" placeholder="请输入文章分类" />
    </a-form-item>

    <!-- 难度等级 -->
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

    <!-- 题目分数 -->
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

    <!-- 选择题类型 -->
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

    <!-- 选项 -->
    <a-form-item
      label="选项"
      :required="true"
    >
      <div v-for="(option, index) in options" :key="index" class="option-item">
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
      <a-button @click="addOption" style="margin-top: 10px">添加选项</a-button>
    </a-form-item>

    <!-- 正确答案 -->
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

    <!-- 答案解析 -->
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
        <a-button size="small" @click="insertMarkdownTemplate('analysis', 'red', formState)">红色文字</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('analysis', 'bold', formState)" style="margin-left: 8px">粗体</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('analysis', 'code', formState)" style="margin-left: 8px">代码</a-button>
        <a-button size="small" @click="insertMarkdownTemplate('analysis', 'image', formState)" style="margin-left: 5px">图片</a-button>
      </div>
    </a-form-item>


    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="handleSubmit" :loading="confirmLoading">提交
      </a-button>
      <a-button style="margin-left: 10px" @click="handleCancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { message } from 'ant-design-vue';
import { createChoiceQuestion } from '@/api/ruankao/exam/exam.ts';
import {insertMarkdownTemplate} from "@/utils/markdownUtils";

const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'cancel'): void;
}>();

const formRef = ref();

interface Option {
  label: string;
  content: string;
}

// 扁平化数据结构
const formState = reactive({
  title: '',
  difficulty: undefined as number | undefined,
  score: undefined as number | undefined,
  type: 'CHOICE',
  choiceType: 1, // 1-单选 2-多选
  correctAnswers: '',
  categoryName: '',
  analysis: ''
});

const options = ref<Option[]>([
  { label: 'A', content: '' },
  { label: 'B', content: '' },
  { label: 'C', content: '' },
  { label: 'D', content: '' }
]);

const selectedAnswers = ref<string[]>([]);

const confirmLoading = ref(false);
const labelCol = { span: 4 };
const wrapperCol = { span: 14 };

// 添加选项
const addOption = () => {
  const nextLabel = String.fromCharCode(65 + options.value.length);
  options.value.push({ label: nextLabel, content: '' });
};

// 删除选项
const removeOption = (index: number) => {
  if (options.value.length <= 2) {
    message.warning('至少需要两个选项');
    return;
  }
  options.value.splice(index, 1);
};

// 监听选项变化，更新正确答案选项
watch(options, () => {
  // 如果是单选题，检查正确答案是否还在选项中
  if (formState.choiceType === 1) {
    const labels = options.value.map(opt => opt.label);
    if (formState.correctAnswers && !labels.includes(formState.correctAnswers)) {
      formState.correctAnswers = '';
    }
  }
  // 如果是多选题，检查已选答案是否还在选项中
  else {
    const labels = options.value.map(opt => opt.label);
    selectedAnswers.value = selectedAnswers.value.filter(answer => labels.includes(answer));
  }
}, { deep: true });

// 监听选择题类型变化
watch(() => formState.choiceType, (newVal) => {
  // 切换类型时清空正确答案
  formState.correctAnswers = '';
  selectedAnswers.value = [];
});

// 提交表单
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

    // 设置选项和正确答案
    const questionData = {
      title: formState.title,
      difficulty: formState.difficulty,
      score: formState.score,
      categoryName: formState.categoryName,
      type: 'CHOICE'
    };

    const choiceDetailData = {
      choiceType: formState.choiceType,
      options: JSON.stringify(options.value),
      correctAnswers: formState.choiceType === 2 ? selectedAnswers.value.join(',') : formState.correctAnswers,
      analysis: formState.analysis
    };

    // 提交数据
    await createChoiceQuestion({
      question: questionData,
      choiceDetail: choiceDetailData
    });

    emit('submit');
  } catch (error: any) {
    if (error?.errorFields) {
      // 表单验证失败
      console.log('表单验证失败');
    } else {
      console.error('创建选择题失败', error);
      message.error('创建选择题失败');
    }
  } finally {
    confirmLoading.value = false;
  }
};

// 取消
const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.option-item {
  margin-bottom: 10px;
}
</style>
