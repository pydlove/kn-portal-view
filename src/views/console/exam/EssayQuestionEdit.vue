<!-- src/views/console/exam/components/EssayQuestion.vue -->
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
      label="题目要求"
      name="requirement"
      :rules="[{ required: true, message: '请输入题目要求' }]"
    >
      <a-textarea
        v-model:value="formState.requirement"
        placeholder="请输入题目要求"
        :auto-size="{ minRows: 4, maxRows: 8 }"
      />
    </a-form-item>

    <a-form-item
      label="字数限制"
    >
      <a-input-group compact>
        <a-input
          v-model:value="formState.wordLimitMin"
          placeholder="最小字数"
          style="width: 40%"
        />
        <a-input
          style="width: 20%; border-left: 0; pointer-events: none; text-align: center"
          placeholder="~"
          disabled
        />
        <a-input
          v-model:value="formState.wordLimitMax"
          placeholder="最大字数"
          style="width: 40%; border-left: 0"
        />
      </a-input-group>
    </a-form-item>

    <a-form-item
      label="参考答案"
      name="referenceAnswer"
    >
      <a-textarea
        v-model:value="formState.referenceAnswer"
        placeholder="请输入参考答案"
        :auto-size="{ minRows: 4, maxRows: 8 }"
      />
    </a-form-item>

    <a-form-item
      label="评分标准"
      name="scoringCriteria"
    >
      <a-textarea
        v-model:value="formState.scoringCriteria"
        placeholder="请输入评分标准"
        :auto-size="{ minRows: 4, maxRows: 8 }"
      />
    </a-form-item>

    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="handleSubmit" :loading="confirmLoading">
        提交
      </a-button>
      <a-button style="margin-left: 10px" @click="onCancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { getQuestion, getEssayDetail, updateQuestion, updateEssayDetail } from '@/api/exam/exam.ts';

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
  type: 'ESSAY',
  requirement: '',
  wordLimitMin: undefined as number | undefined,
  wordLimitMax: undefined as number | undefined,
  referenceAnswer: '',
  scoringCriteria: ''
});

const fetchDetail = async () => {
  try {
    const [question, essayDetail] = await Promise.all([
      getQuestion(Number(props.questionId)),
      getEssayDetail(Number(props.questionId))
    ]);

    // 设置表单数据
    formState.title = question.title;
    formState.difficulty = question.difficulty;
    formState.score = question.score;
    formState.type = question.type;
    formState.requirement = essayDetail.requirement;
    formState.wordLimitMin = essayDetail.wordLimitMin;
    formState.wordLimitMax = essayDetail.wordLimitMax;
    formState.referenceAnswer = essayDetail.referenceAnswer;
    formState.scoringCriteria = essayDetail.scoringCriteria;
  } catch (error) {
    console.error('获取论文题详情失败', error);
    message.error('获取论文题详情失败');
  }
};

const handleSubmit = async () => {
  confirmLoading.value = true;
  try {
    // 表单验证
    await formRef.value.validate();

    // 构造提交数据
    const questionData = {
      id: Number(props.questionId),
      title: formState.title,
      difficulty: formState.difficulty,
      score: formState.score,
      type: formState.type
    };

    const essayData = {
      questionId: Number(props.questionId),
      requirement: formState.requirement,
      wordLimitMin: formState.wordLimitMin,
      wordLimitMax: formState.wordLimitMax,
      referenceAnswer: formState.referenceAnswer,
      scoringCriteria: formState.scoringCriteria
    };

    // 提交数据
    await Promise.all([
      updateQuestion(Number(props.questionId), questionData),
      updateEssayDetail(Number(props.questionId), essayData)
    ]);

    message.success('更新论文题成功');
    emit('submit');
  } catch (error: any) {
    if (error?.errorFields) {
      // 表单验证失败
      console.log('表单验证失败');
    } else {
      console.error('更新论文题失败', error);
      message.error('更新论文题失败');
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
