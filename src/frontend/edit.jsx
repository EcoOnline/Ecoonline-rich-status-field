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
  Button,
  Box,
  Inline
} from "@forge/react";
import { view, requestJira } from '@forge/bridge';
import { DEFAULT_CONFIGURATION } from '../data/default_config';

const Edit = () => {
  const [renderContext, setRenderContext] = useState(null);
  const [fieldValue, setFieldValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, register, getFieldId, getValues } = useForm();
  const [field_config, setFieldConfig] = useState(() => ({...DEFAULT_CONFIGURATION}));
  const defaultConfig = {...DEFAULT_CONFIGURATION};
  const ragList = defaultConfig.ragList;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const context = await view.getContext();
        console.log("context:", context);
  
        if (context?.extension?.renderContext) {
          setRenderContext(context.extension.renderContext);
        }
  
        if (context?.extension?.fieldValue) {
          setFieldValue(context.extension.fieldValue);
        }
  
        if (context?.extension?.configuration) {
          console.log("context config:", context.extension.configuration);
          setFieldConfig(context.extension.configuration);
        }
  
        const fieldId = context.extension.fieldId;
        const issueId = context.extension.issue.id;
        const response = await requestJira(`/rest/api/3/app/field/${fieldId}/context/configuration?issueid=${issueId}`);
        const data = await response.json();
        const contextConfig = data?.values[0]?.configuration;
        console.log("data from api", data);
        setFieldConfig(prevConfig => ({
          ...prevConfig,
          progressList: contextConfig?.progressList || defaultConfig.progressList
        }));
        console.log("progressList from context: ", field_config?.progressList );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);


  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const { progress, rag, bold } = getValues();
      const progressValue = progress?.value ? progress.value : fieldValue?.progress;
      const ragValue = rag?.value ? rag.value : fieldValue?.rag;
      const boldValue = bold?.value ? bold.value : fieldValue?.bold;

      await view.submit({"progress":progressValue, "rag":ragValue, "bold":boldValue});

      
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };

  return renderContext === 'issue-view' ? (
    
    <Form onSubmit={handleSubmit(onSubmit)}>
              <Label labelFor={getFieldId('progress')}>
                Progress status
              </Label>
              <Select {...register('progress')} options=
                {field_config?.progressList?.map((option) => (
                  {value: option.label, label: option.label}
                ))}
                defaultValue = {{
                  label: fieldValue?.progress,
                  value: fieldValue?.progress,
                }}
              />
              <Label labelFor={getFieldId('rag')}>
                Color
              </Label>
              <Select
                {...register('rag')}
                options={ragList?.map((option) => ({
                  value: option.label,
                  label: option.label
                }))}
                defaultValue={{
                  label: fieldValue?.rag,
                  value: fieldValue?.rag
                }}
              />
              <Label labelFor={getFieldId('bold')}>
                Bold
              </Label>
              <Select
                {...register('bold')}
                options={[
                  {value: 0, label: "No"},
                  {value: 1, label: "Yes"}]
                }
                defaultValue={{
                  value: fieldValue?.bold === 1 ?  1 : 0,
                  label: fieldValue?.bold === 1 ?  "Yes" : "No"
                }}
              />

        <FormFooter>
          <ButtonGroup>
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
              <Label labelFor={getFieldId('progress')}>
                Progress status
              </Label>
              <Select {...register('progress')} options=
                {field_config?.progressList?.map((option) => (
                  {value: option.label, label: option.label}
                ))}
                defaultValue = {{
                  label: fieldValue?.progress,
                  value: fieldValue?.progress,
                }}
              />
            </Box>
            <Box>
              <Label labelFor={getFieldId('rag')}>
                Color
              </Label>
              <Select
                {...register('rag')}
                options={ragList.map((option) => ({
                  value: option.label,
                  label: option.label
                }))}
                defaultValue={{
                  label: fieldValue?.rag,
                  value: fieldValue?.rag
                }}
              />
            </Box>
            <Box>
              <Label labelFor={getFieldId('bold')}>
                Bold
              </Label>
              <Select
                {...register('bold')}
                options={[
                  {value: 0, label: "No"},
                  {value: 1, label: "Yes"}]
                }
                defaultValue={{
                  value: fieldValue?.bold === 1 ?  1 : 0,
                  label: fieldValue?.bold === 1 ?  "Yes" : "No"
                }}
              />
            </Box>
          </Inline>
    </Form>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <Edit />
  </React.StrictMode>
);
