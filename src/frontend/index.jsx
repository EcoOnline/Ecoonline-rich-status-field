import React, { useState, useEffect } from 'react';
import ForgeReconciler, {
  Lozenge,
  Text,
  DynamicTable
} from "@forge/react";
import { view, requestJira } from '@forge/bridge';
import { DEFAULT_CONFIGURATION, TABLE_HEADERS, DEFAULT_VALUE } from '../data/default_config';
import { findProgress } from '../utils/utils';



const View = () => {
  const heads = { ...TABLE_HEADERS};
  const defaultConfig = {...DEFAULT_CONFIGURATION}; 
  const defaultValue = {...DEFAULT_VALUE};
  const [extension, setExtension] = useState(null);
  const [renderContext, setRenderContext] = useState(null);
  const [field_config, setFieldConfig] = useState(null);
  const [fieldValue, setFieldValue] = useState(defaultValue);
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const context = await view.getContext();

        //console.log("context.extension:", context.extension);
        //console.log("context.extension.renderContext:", context.extension?.renderContext);
        if (context?.extension?.renderContext) {
          setRenderContext(context.extension.renderContext);
          //console.log("context.extension:", context.extension);
        }
  
       if (context?.extension?.fieldValue && context?.extension?.fieldValue?.resultCount) {
          setFieldValue(context?.extension?.fieldValue);
          console.log("fieldValue", context?.extension?.fieldValue);
        }
         
        if (context?.extension?.configuration) {
          //console.log("context config:", context.extension.configuration);
          setFieldConfig(context.extension.configuration);
        }
        //console.log("content extension:", context.extension );
        const fieldId = context.extension.fieldId;
        const issueId = context.extension.issue.id;
        const response = await requestJira(`/rest/api/3/app/field/${fieldId}/context/configuration?issueid=${issueId}`);
        const data = await response.json();
        console.log("data from api", data);
        const contextConfig = data?.values[0]?.configuration || defaultConfig;
        
        setFieldConfig(prevConfig => ({
          ...prevConfig,
          progressList: contextConfig?.progressList || defaultConfig.progressList
        }));
        console.log("fieldValue", fieldValue);
        //console.log("fieldConfig: ", field_config);
      
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

  }, []);

  const resultRows = () => {
    const rows = [];
    for (let i = 0; i < fieldValue.resultCount; i++) {
      if (fieldValue[`result_${i}`]) {
        rows.push({
          key: `row_${i}`,
          cells: [
            {
              key: fieldValue[`result_${i}`]?.result,
              content: fieldValue[`result_${i}`]?.result,
            },
            {
              key: findProgress(fieldValue[`result_${i}`].status, field_config.progressList).rag,
              content: (
                <Lozenge 
                  appearance={findProgress(fieldValue[`result_${i}`].status, field_config.progressList).rag} 
                  isBold = {findProgress(fieldValue[`result_${i}`].status, field_config.progressList).isbold}
                >
                  {fieldValue[`result_${i}`]?.status}
                </Lozenge>
              ),
            },
            {
              key: fieldValue[`result_${i}`]?.eta,
              content: fieldValue[`result_${i}`]?.eta,
            },
          ],
        });
      }
    }
    return rows; 
  }
  //console.log("Rich status field value:",  extension?.fieldValue);
  return (
    field_config  ? ( 
        <DynamicTable
          defaultSortOrder= "Asc"
          defaultSortKey="eta"
          head={heads}
          rows={fieldValue && fieldValue?.resultCount > 0 ? resultRows() : []}  
        />)
     : (<Text>Loading...</Text> )
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <View />
  </React.StrictMode>
);
