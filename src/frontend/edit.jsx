import React, { useState, useEffect } from 'react';
import ForgeReconciler, {
  Form,
  Label,
  Select,
  Textfield,
  useForm,
  FormSection,
  FormFooter,
  ButtonGroup,
  LoadingButton,
  Lozenge,
  Button,
  Box,
  Inline, 
  Text,
  TextArea,
  DatePicker,
  xcss
} from "@forge/react";
import { view, requestJira } from '@forge/bridge';
import { DEFAULT_CONFIGURATION, DEFAULT_VALUE, TABLE_HEADERS } from '../data/default_config';
import { newFieldKey } from '../utils/utils';

const containerStyles = xcss({
  width: '50%',
});

const progressEditStyles = xcss({
  width: '30%'
});

const ragEditStyles = xcss({
  width: '30%'
}); 
const boldEditStyles = xcss({
  width: '20%'
}); 


const heads = { ...TABLE_HEADERS};
const Edit = () => {
  const defaultConfig = {...DEFAULT_CONFIGURATION};
  const defaultValue = {...DEFAULT_VALUE};
  const [renderContext, setRenderContext] = useState(null);
  const [fieldValue, setFieldValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, register, getFieldId, getValues, trigger } = useForm();
  const [field_config, setFieldConfig] = useState(null);
  const [propArray, setPropArray] = useState([]);
  const [resultCount, setResultCount] = useState([]);

  const ragList = defaultConfig.ragList;

  //console.log("fieldValue:", fieldValue)

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
          convertFieldValueToArray(context?.extension?.fieldValue);
          setResultCount(context?.extension?.fieldValue?.resultCount || 0);
        }
         
        if (context?.extension?.configuration) {
         //console.log("context config:", context.extension.configuration);
          setFieldConfig(context.extension.configuration);
        }
  
        const fieldId = context.extension.fieldId;
        const issueId = context.extension.issue.id;
        const response = await requestJira(`/rest/api/3/app/field/${fieldId}/context/configuration?issueid=${issueId}`);
        const data = await response.json();
        const contextConfig = data?.values[0]?.configuration;
        //console.log("data from api", data);
        setFieldConfig(prevConfig => ({
          ...prevConfig,
          progressList: contextConfig?.progressList || defaultConfig.progressList
        }));
        //console.log("fieldConfig: ", field_config);
      
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

  }, []);

  const convertFieldValueToArray = (values) => {
    //console.log("raw values :", values);
    let valueArray = []
    
    for (let index=0; index < values.resultCount; index++) {
      valueArray[index] = {};
      valueArray[index]["result"] = values[`result_${index}`]?.result ? values[`result_${index}`].result : "";
      valueArray[index]["status"] = values[`result_${index}`]?.status ? values[`result_${index}`].status : "";
      valueArray[index]["eta"] = values[`result_${index}`]?.eta ? values[`result_${index}`].eta : "";
      valueArray[index]["isdeleted"] = false;
      valueArray[index]["key"] = newFieldKey(16);
    }
    //console.log("values array:", valueArray);
    setPropArray(valueArray);

  };

  const addResult = () => {
    let copy = propArray;
    copy.push({
      result:"",
      status:"",
      eta:"",
      isdeleted:false,
      key: newFieldKey(16)
    });
    setResultCount(resultCount+1);
    setPropArray(copy);
    //console.log("props on add:", copy);
    trigger();
  };

  const deleteResult = (delIndex) => {
    let copy = propArray;
    copy[delIndex].isdeleted=true;
    setPropArray(copy);
    setResultCount(resultCount-1);
    trigger();
  };


    const onSubmit = async () => {
    try {
      setIsLoading(true);
      let newValue={};
      const formValues = getValues();
      console.log("form values: ", formValues);
      let propCount = 0;
      propArray.map((prop, index) => {
        if (!prop.isdeleted) {
          newValue[`result_${propCount}`] = {
            result: formValues[`result_${prop.key}`] || prop.result,
            status:formValues[`status_${prop.key}`]?.label || prop.status,
            eta: formValues[`eta_${prop.key}`] || prop.eta
          };
          propCount++;
        }
      })
      newValue["resultCount"] = +resultCount;
      //console.log("update result_1 value: ", newValue["result_1"]);
      console.log("update value", newValue);
      await view.submit(newValue);

      
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };
  
  return  renderContext === 'issue-view' ? (
    
    <Form onSubmit={handleSubmit(onSubmit)}>

        {propArray.map((prop, index) => (
          <Inline space="space.200">
          <Box paddingBlockEnd="space.100" xcss={containerStyles}>
            <TextArea {...register(`result_${prop.key}`)} defaultValue = {prop.result} isDisabled={prop.isdeleted}/>
          </Box>
          <Box xcss={ragEditStyles} paddingBlockEnd="space.100" paddingInline = "space.100"> 
            <Select {...register(`status_${prop.key}`) }
                    options = 
                    {field_config?.progressList?.map((option) => (
                      {value: option.value, label: option.label}
                    ))}
                    defaultValue = {{
                      label: prop.status,
                      value: prop.status,
                    }}
                    isDisabled={prop.isdeleted}
                    />
            </Box>
            <Box paddingBlockEnd="space.100" xcss={ragEditStyles} isDisabled={prop.isdeleted}>
                  <DatePicker {...register(`eta_${prop.key}`)} 
                  defaultValue = {prop.eta}/>
            </Box>
            <Box paddingBlockEnd="space.100" xcss={boldEditStyles}>
              <Button appearance="subtle" onClick={() => deleteResult(index) } isDisabled={prop.isdeleted}>Delete</Button>
            </Box>
          </Inline>    
        ))}     
        <FormFooter>
          <ButtonGroup> 
            {(resultCount < 5) ? 
              (<Button appearance="subtle" onClick={() => addResult()}>Add</Button>):""}
            <Button appearance="subtle" onClick={view.close}>Close</Button>
            <LoadingButton appearance="primary" type="submit" isLoading={isLoading}>
              Submit
            </LoadingButton>
          </ButtonGroup>
        </FormFooter>
        {field_config?.progressList.map((option) =>  (
          <Box paddingBlockEnd="space.300"></Box>
        ))} 
    </Form>
  ) : (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Inline>
            <Box>
              <Text>
                Progress status
              </Text>

            </Box>
          </Inline>
    </Form>
  )
};

ForgeReconciler.render(
  <React.StrictMode>
    <Edit />
  </React.StrictMode>
);
