// src/utils/markdownUtils.ts
export const insertMarkdownTemplate = (
  field: string,
  indexOrStyle: any,
  formState?: any,
) => {
  let template = '';

  // 确定要插入的模板
  switch (indexOrStyle) {
    case 'red':
      template = "<span style='color:red'>【重要】</span>";
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

  // 插入到指定字段
  if (template) {
    if (field === 'title') {
      const currentTitle = formState.title;

      if (indexOrStyle === 'hdck1') {
        // 替换第一个（）
        formState.title = currentTitle.replace('（）', template);
      } else if (indexOrStyle === 'hdck2') {
        // 替换第二个（）
        const firstIndex = currentTitle.indexOf('（）');
        if (firstIndex !== -1) {
          const secondIndex = currentTitle.indexOf('（）', firstIndex + 1);
          if (secondIndex !== -1) {
            formState.title = currentTitle.substring(0, secondIndex) +
              template +
              currentTitle.substring(secondIndex + 2);
          }
        }
      } else if (indexOrStyle === 'hdck3') {
        // 替换第三个（）
        let count = 0;
        formState.title = currentTitle.replace(/（）/g, (match) => {
          count++;
          if (count === 3) {
            return template;
          }
          return match;
        });
      } else {
        formState.title = currentTitle + (currentTitle ? ' ' : '') + template;
      }

    } else if (field === 'analysis') {
      const currentAnalysis = formState.analysis;
      formState.analysis = currentAnalysis + (currentAnalysis ? ' ' : '') + template;
    } else if (field === 'content') {
      const currentContent = formState.content;
      formState.content = currentContent + (currentContent ? ' ' : '') + template;
    } else if (field === 'referenceAnswer') {
      const currentReferenceAnswer = formState.referenceAnswer;
      formState.referenceAnswer = currentReferenceAnswer + (currentReferenceAnswer ? ' ' : '') + template;
    }
  }
};
