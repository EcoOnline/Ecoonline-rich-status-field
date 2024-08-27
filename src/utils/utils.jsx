import { DEFAULT_CONFIGURATION } from "../data/default_config";
export const findProgress = (value, progressList) => {
    let progress = progressList.find(item => item.label === value)
    if (!progress) {
        progress = DEFAULT_CONFIGURATION.progressList[0];
    } 
    return (progress);
}

export const findRagLabel = (value, ragList) =>  {
    const rag = ragList.find(item => item.value === value)
    const ragLabel = rag?.label || "Grey"
}

export const findStatusIsBold = (value, progressList) =>  {
    const progress = progressList.find(item => item.label === value)
    const ragValue = progress?.rag || "default"
    return (ragValue);
}

export const newFieldKey = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };