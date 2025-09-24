<!-- src/views/console/exam/edit.vue -->
<template>
  <div class="question-edit-container">
    <a-card :title="`编辑${questionTypeText}题`">
      <div v-if="loading" class="loading-container">
        <a-spin size="large"/>
      </div>
      <div v-else>
        <!-- 选择题编辑 -->
        <a-form
          v-if="questionType === 'CHOICE'"
          :model="choiceFormState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          ref="choiceFormRef"
        >
          <a-form-item
            label="题目内容"
            name="title"
            :rules="[{ required: true, message: '请输入题目内容' }]"
          >
            <a-textarea
              v-model:value="choiceFormState.question.title"
              placeholder="请输入题目内容"
              :auto-size="{ minRows: 3, maxRows: 6 }"
            />
          </a-form-item>

          <a-form-item
            label="难度等级"
            name="difficulty"
            :rules="[{ required: true, message: '请选择难度等级' }]"
          >
            <a-select v-model:value="choiceFormState.question.difficulty"
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
              v-model:value="choiceFormState.question.score"
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
            <a-radio-group v-model:value="choiceFormState.choiceDetail.choiceType">
              <a-radio :value="1">单选题</a-radio>
              <a-radio :value="2">多选题</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item
            label="选项"
            :required="true"
          >
            <div v-for="(option, index) in choiceOptions" :key="index"
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
                  @click="removeChoiceOption(index)"
                  style="margin-left: 10px"
                >
                  删除
                </a-button>
              </a-input-group>
            </div>
            <a-button @click="addChoiceOption" style="margin-top: 10px">添加选项
            </a-button>
          </a-form-item>

          <a-form-item
            label="正确答案"
            name="correctAnswers"
            :rules="[{ required: true, message: '请选择正确答案' }]"
          >
            <div v-if="choiceFormState.choiceDetail.choiceType === 1">
              <!-- 单选题 -->
              <a-radio-group v-model:value="choiceFormState.choiceDetail.correctAnswers">
                <a-radio
                  v-for="(option, index) in choiceOptions"
                  :key="index"
                  :value="option.label"
                >
                  {{ option.label }}
                </a-radio>
              </a-radio-group>
            </div>
            <div v-else>
              <!-- 多选题 -->
              <a-checkbox-group v-model:value="choiceSelectedAnswers">
                <a-row>
                  <a-col
                    v-for="(option, index) in choiceOptions"
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
              v-model:value="choiceFormState.choiceDetail.analysis"
              placeholder="请输入答案解析"
              :auto-size="{ minRows: 3, maxRows: 6 }"
            />
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="handleChoiceSubmit"
                      :loading="confirmLoading">提交
            </a-button>
            <a-button style="margin-left: 10px" @click="handleCancel">取消</a-button>
          </a-form-item>
        </a-form>

        <!-- 案例题编辑 -->
        <a-form
          v-else-if="questionType === 'CASE'"
          :model="caseFormState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          ref="caseFormRef"
        >
          <a-form-item
            label="题目内容"
            name="title"
            :rules="[{ required: true, message: '请输入题目内容' }]"
          >
            <a-textarea
              v-model:value="caseFormState.question.title"
              placeholder="请输入题目内容"
              :auto-size="{ minRows: 3, maxRows: 6 }"
            />
          </a-form-item>

          <a-form-item
            label="难度等级"
            name="difficulty"
            :rules="[{ required: true, message: '请选择难度等级' }]"
          >
            <a-select v-model:value="caseFormState.question.difficulty"
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
              v-model:value="caseFormState.question.score"
              placeholder="请输入题目分数"
              :min="0"
              :step="0.5"
            />
          </a-form-item>

          <a-form-item
            label="案例背景"
            name="background"
            :rules="[{ required: true, message: '请输入案例背景' }]"
          >
            <a-textarea
              v-model:value="caseFormState.caseDetail.background"
              placeholder="请输入案例背景"
              :auto-size="{ minRows: 4, maxRows: 8 }"
            />
          </a-form-item>

          <a-form-item
            label="题目要求"
            name="requirement"
            :rules="[{ required: true, message: '请输入题目要求' }]"
          >
            <a-textarea
              v-model:value="caseFormState.caseDetail.requirement"
              placeholder="请输入题目要求"
              :auto-size="{ minRows: 4, maxRows: 8 }"
            />
          </a-form-item>

          <a-form-item
            label="参考答案"
            name="referenceAnswer"
          >
            <a-textarea
              v-model:value="caseFormState.caseDetail.referenceAnswer"
              placeholder="请输入参考答案"
              :auto-size="{ minRows: 4, maxRows: 8 }"
            />
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="handleCaseSubmit" :loading="confirmLoading">
              提交
            </a-button>
            <a-button style="margin-left: 10px" @click="handleCancel">取消</a-button>
          </a-form-item>
        </a-form>

        <!-- 论文题编辑 -->
        <a-form
          v-else-if="questionType === 'ESSAY'"
          :model="essayFormState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          ref="essayFormRef"
        >
          <a-form-item
            label="题目内容"
            name="title"
            :rules="[{ required: true, message: '请输入题目内容' }]"
          >
            <a-textarea
              v-model:value="essayFormState.question.title"
              placeholder="请输入题目内容"
              :auto-size="{ minRows: 3, maxRows: 6 }"
            />
          </a-form-item>

          <a-form-item
            label="难度等级"
            name="difficulty"
            :rules="[{ required: true, message: '请选择难度等级' }]"
          >
            <a-select v-model:value="essayFormState.question.difficulty"
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
              v-model:value="essayFormState.question.score"
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
              v-model:value="essayFormState.essayDetail.requirement"
              placeholder="请输入题目要求"
              :auto-size="{ minRows: 4, maxRows: 8 }"
            />
          </a-form-item>

          <a-form-item
            label="字数限制"
          >
            <a-input-group compact>
              <a-input
                v-model:value="essayFormState.essayDetail.wordLimitMin"
                placeholder="最小字数"
                style="width: 40%"
              />
              <a-input
                style="width: 20%; border-left: 0; pointer-events: none; text-align: center"
                placeholder="~"
                disabled
              />
              <a-input
                v-model:value="essayFormState.essayDetail.wordLimitMax"
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
              v-model:value="essayFormState.essayDetail.referenceAnswer"
              placeholder="请输入参考答案"
              :auto-size="{ minRows: 4, maxRows: 8 }"
            />
          </a-form-item>

          <a-form-item
            label="评分标准"
            name="scoringCriteria"
          >
            <a-textarea
              v-model:value="essayFormState.essayDetail.scoringCriteria"
              placeholder="请输入评分标准"
              :auto-size="{ minRows: 4, maxRows: 8 }"
            />
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="handleEssaySubmit" :loading="confirmLoading">
              提交
            </a-button>
            <a-button style="margin-left: 10px" @click="handleCancel">取消</a-button>
          </a-form-item>
        </a-form>

        <!-- 添加文章题表单模板-->
        <a-form
          v-else-if="questionType === 'ARTICLE'"
          :model="articleFormState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          ref="articleFormRef"
        >
          <a-form-item
            label="题目内容"
            name="title"
            :rules="[{ required: true, message: '请输入题目内容' }]"
          >
            <a-textarea
              v-model:value="articleFormState.question.title"
              placeholder="请输入题目内容"
              :auto-size="{ minRows: 3, maxRows: 6 }"
            />
          </a-form-item>

          <a-form-item
            label="文章内容"
            name="content"
            :rules="[{ required: true, message: '请输入文章内容' }]"
          >
            <a-tabs v-model:activeKey="articleActiveKey">
              <a-tab-pane key="editor" tab="编辑">
                <div class="markdown-editor">
                  <a-textarea
                    v-model:value="articleFormState.articleDetail.content"
                    placeholder="请输入Markdown格式的文章内容"
                    :auto-size="{ minRows: 10, maxRows: 15 }"
                  />
                  <div class="editor-help">
                    <a href="https://markdown.com.cn/" target="_blank">Markdown
                      语法参考</a>
                  </div>
                </div>
              </a-tab-pane>
              <a-tab-pane key="preview" tab="预览">
                <div class="markdown-preview" v-html="articleRenderedMarkdown"></div>
              </a-tab-pane>
            </a-tabs>
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="handleArticleSubmit"
                      :loading="confirmLoading">提交
            </a-button>
            <a-button style="margin-left: 10px" @click="handleCancel">取消</a-button>
          </a-form-item>
        </a-form>

      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {message} from 'ant-design-vue';
import {
  getQuestion,
  getChoiceDetail,
  getCaseDetail,
  getEssayDetail,
  updateQuestion,
  updateChoiceDetail,
  updateCaseDetail,
  updateEssayDetail, updateArticleDetail, getArticleDetail
} from '../../../api/exam/exam.ts';

// 在文件顶部导入 marked
import {marked} from 'marked';

// 在 script setup 部分添加以下代码
const articleActiveKey = ref('editor');

const articleRenderedMarkdown = computed(() => {
  return marked(articleFormState.articleDetail.content);
});

const route = useRoute();
const router = useRouter();

interface Option {
  label: string;
  content: string;
}

// 表单引用
const choiceFormRef = ref();
const caseFormRef = ref();
const essayFormRef = ref();

// 加载状态
const loading = ref(true);
const confirmLoading = ref(false);

// 题目ID
const questionId = computed(() => route.params.id as string);

// 题目类型
const questionType = ref('');
const questionTypeText = computed(() => {
  switch (questionType.value) {
    case 'CHOICE':
      return '选择';
    case 'CASE':
      return '案例';
    case 'ESSAY':
      return '论文';
    case 'ARTICLE':
      return '文章';
    default:
      return '';
  }
});

// 表单布局
const labelCol = {span: 4};
const wrapperCol = {span: 14};

// 选择题表单
const choiceFormState = reactive({
  question: {
    id: undefined as number | undefined,
    title: '',
    difficulty: undefined as number | undefined,
    score: undefined as number | undefined,
    type: 'CHOICE'
  },
  choiceDetail: {
    questionId: undefined as number | undefined,
    choiceType: 1,
    options: [] as Option[],
    correctAnswers: '',
    analysis: ''
  }
});

const choiceOptions = ref<Option[]>([
  {label: 'A', content: ''},
  {label: 'B', content: ''},
  {label: 'C', content: ''},
  {label: 'D', content: ''}
]);

const choiceSelectedAnswers = ref<string[]>([]);

// 案例题表单
const caseFormState = reactive({
  question: {
    id: undefined as number | undefined,
    title: '',
    difficulty: undefined as number | undefined,
    score: undefined as number | undefined,
    type: 'CASE'
  },
  caseDetail: {
    questionId: undefined as number | undefined,
    background: '',
    requirement: '',
    referenceAnswer: ''
  }
});

// 论文题表单
const essayFormState = reactive({
  question: {
    id: undefined as number | undefined,
    title: '',
    difficulty: undefined as number | undefined,
    score: undefined as number | undefined,
    type: 'ESSAY'
  },
  essayDetail: {
    questionId: undefined as number | undefined,
    requirement: '',
    wordLimitMin: undefined as number | undefined,
    wordLimitMax: undefined as number | undefined,
    referenceAnswer: '',
    scoringCriteria: ''
  }
});

// 添加文章题表单
const articleFormState = reactive({
  question: {
    id: undefined as number | undefined,
    title: '',
    difficulty: undefined as number | undefined,
    score: undefined as number | undefined,
    type: 'ARTICLE'
  },
  articleDetail: {
    questionId: undefined as number | undefined,
    content: ''
  }
});

// 添加选项
const addChoiceOption = () => {
  const nextLabel = String.fromCharCode(65 + choiceOptions.value.length);
  choiceOptions.value.push({label: nextLabel, content: ''});
};

// 删除选项
const removeChoiceOption = (index: number) => {
  if (choiceOptions.value.length <= 2) {
    message.warning('至少需要两个选项');
    return;
  }
  choiceOptions.value.splice(index, 1);
};

// 获取题目详情
const fetchQuestionDetail = async () => {
  try {
    loading.value = true;

    // 获取题目基本信息
    const question = await getQuestion(Number(questionId.value));
    questionType.value = question.type;

    // 根据题目类型获取详细信息
    switch (question.type) {
      case 'CHOICE':
        await fetchChoiceDetail(Number(questionId.value));
        break;
      case 'CASE':
        await fetchCaseDetail(Number(questionId.value));
        break;
      case 'ESSAY':
        await fetchEssayDetail(Number(questionId.value));
        break;
      case 'ARTICLE':
        await fetchArticleDetail(Number(questionId.value));
        break;
    }
  } catch (error) {
    console.error('获取题目详情失败', error);
    message.error('获取题目详情失败');
  } finally {
    loading.value = false;
  }
};

// 获取选择题详情
const fetchChoiceDetail = async (id: number) => {
  const [question, choiceDetail] = await Promise.all([
    getQuestion(id),
    getChoiceDetail(id)
  ]);

  // 设置题目基本信息
  choiceFormState.question = {
    ...choiceFormState.question,
    ...question,
    id: Number(questionId.value)
  };

  // 设置选择题详情
  choiceFormState.choiceDetail = {
    ...choiceFormState.choiceDetail,
    ...choiceDetail,
    questionId: Number(questionId.value)
  };

  // 设置选项
  if (choiceDetail.options) {
    choiceOptions.value = Array.isArray(choiceDetail.options)
      ? choiceDetail.options
      : JSON.parse(choiceDetail.options as string);
  }

  // 设置正确答案
  if (choiceDetail.choiceType === 2) {
    choiceSelectedAnswers.value = choiceDetail.correctAnswers
      ? choiceDetail.correctAnswers.split(',')
      : [];
  }
};

// 获取案例题详情
const fetchCaseDetail = async (id: number) => {
  const [question, caseDetail] = await Promise.all([
    getQuestion(id),
    getCaseDetail(id)
  ]);

  // 设置题目基本信息
  caseFormState.question = {
    ...caseFormState.question,
    ...question,
    id: Number(questionId.value)
  };

  // 设置案例题详情
  caseFormState.caseDetail = {
    ...caseFormState.caseDetail,
    ...caseDetail,
    questionId: Number(questionId.value)
  };
};

// 获取论文题详情
const fetchEssayDetail = async (id: number) => {
  const [question, essayDetail] = await Promise.all([
    getQuestion(id),
    getEssayDetail(id)
  ]);

  // 设置题目基本信息
  essayFormState.question = {
    ...essayFormState.question,
    ...question,
    id: Number(questionId.value)
  };

  // 设置论文题详情
  essayFormState.essayDetail = {
    ...essayFormState.essayDetail,
    ...essayDetail,
    questionId: Number(questionId.value)
  };
};

// 添加获取文章题详情函数
const fetchArticleDetail = async (id: number) => {
  const [question, articleDetail] = await Promise.all([
    getQuestion(id),
    getArticleDetail(id)
  ]);

  // 设置题目基本信息
  articleFormState.question = {
    ...articleFormState.question,
    ...question,
    id: Number(questionId.value)
  };

  // 设置文章详情
  articleFormState.articleDetail = {
    ...articleFormState.articleDetail,
    ...articleDetail,
    questionId: Number(questionId.value)
  };
};

// 提交选择题
const handleChoiceSubmit = async () => {
  confirmLoading.value = true;
  try {
    // 表单验证
    await choiceFormRef.value.validate();

    // 检查选项内容是否填写完整
    const emptyOptions = choiceOptions.value.filter(opt => !opt.content.trim());
    if (emptyOptions.length > 0) {
      message.error('请填写所有选项内容');
      throw new Error('选项内容不完整');
    }

    // 检查是否有正确答案
    if (choiceFormState.choiceDetail.choiceType === 1 && !choiceFormState.choiceDetail.correctAnswers) {
      message.error('请选择正确答案');
      throw new Error('未选择正确答案');
    }

    if (choiceFormState.choiceDetail.choiceType === 2 && choiceSelectedAnswers.value.length === 0) {
      message.error('请选择正确答案');
      throw new Error('未选择正确答案');
    }

    // 设置选项和正确答案
    choiceFormState.choiceDetail.options = choiceOptions.value;

    if (choiceFormState.choiceDetail.choiceType === 2) {
      choiceFormState.choiceDetail.correctAnswers = choiceSelectedAnswers.value.join(',');
    }

    // 提交数据
    await Promise.all([
      updateQuestion(Number(questionId.value), choiceFormState.question),
      updateChoiceDetail(Number(questionId.value), choiceFormState.choiceDetail)
    ]);

    message.success('更新选择题成功');
    router.push('/exam/question');
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

// 提交案例题
const handleCaseSubmit = async () => {
  confirmLoading.value = true;
  try {
    // 表单验证
    await caseFormRef.value.validate();

    // 提交数据
    await Promise.all([
      updateQuestion(Number(questionId.value), caseFormState.question),
      updateCaseDetail(Number(questionId.value), caseFormState.caseDetail)
    ]);

    message.success('更新案例题成功');
    router.push('/exam/question');
  } catch (error: any) {
    if (error?.errorFields) {
      // 表单验证失败
      console.log('表单验证失败');
    } else {
      console.error('更新案例题失败', error);
      message.error('更新案例题失败');
    }
  } finally {
    confirmLoading.value = false;
  }
};

// 提交论文题
const handleEssaySubmit = async () => {
  confirmLoading.value = true;
  try {
    // 表单验证
    await essayFormRef.value.validate();

    // 提交数据
    await Promise.all([
      updateQuestion(Number(questionId.value), essayFormState.question),
      updateEssayDetail(Number(questionId.value), essayFormState.essayDetail)
    ]);

    message.success('更新论文题成功');
    router.push('/exam/question');
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

// 添加提交文章题函数
const handleArticleSubmit = async () => {
  confirmLoading.value = true;
  try {
    // 表单验证
    await articleFormRef.value.validate();

    // 提交数据
    await Promise.all([
      updateQuestion(Number(questionId.value), articleFormState.question),
      updateArticleDetail(Number(questionId.value), articleFormState.articleDetail)
    ]);

    message.success('更新文章题成功');
    router.push('/exam/question');
  } catch (error: any) {
    if (error?.errorFields) {
      // 表单验证失败
      console.log('表单验证失败');
    } else {
      console.error('更新文章题失败', error);
      message.error('更新文章题失败');
    }
  } finally {
    confirmLoading.value = false;
  }
};

// 取消
const handleCancel = () => {
  router.push('/exam/question');
};

onMounted(() => {
  fetchQuestionDetail();
});
</script>

<style scoped>
.question-edit-container {
  padding: 16px;
}

.loading-container {
  text-align: center;
  padding: 50px 0;
}

.option-item {
  margin-bottom: 10px;
}

.question-edit-container {
  padding: 16px;
}

.loading-container {
  text-align: center;
  padding: 50px 0;
}

.option-item {
  margin-bottom: 10px;
}

.markdown-editor {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.editor-help {
  padding: 8px;
  background-color: #f5f5f5;
  border-top: 1px solid #d9d9d9;
}

.markdown-preview {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 16px;
  min-height: 200px;
  background-color: #fff;
}
</style>

<style>
/* Markdown预览样式 */
.markdown-preview h1,
.markdown-preview h2,
.markdown-preview h3 {
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.markdown-preview p {
  margin-bottom: 1em;
}

.markdown-preview ul,
.markdown-preview ol {
  padding-left: 20px;
  margin-bottom: 1em;
}

.markdown-preview li {
  margin-bottom: 0.5em;
}

.markdown-preview pre {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow: auto;
}

.markdown-preview code {
  background-color: #f5f5f5;
  padding: 2px 4px;
  border-radius: 2px;
}

.markdown-preview blockquote {
  border-left: 4px solid #d9d9d9;
  padding-left: 16px;
  margin-left: 0;
  color: #666;
}
</style>
