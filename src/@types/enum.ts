
/** 题型 */
export enum QuestionSubmitCategoryEnum {
  /** 文本问答题 */
  'single-text' = 'answer',
  /** 单行问答组 */
  'single-text-group' = 'oid',
  /** 多行文本问答题 */
  'multiple-text' = 'answer',
  /** 单项选择题 */
  'single-choice' = 'oid',
  /** 多项选择题 */
  'multiple-choice' = 'oid',
  /** 评分题 */
  'rate' = 'answer',
  /** 多项评分题 */
  'rate-group' = 'oid',
  /** 选择题 */
  'dropdown' = 'oid',
}