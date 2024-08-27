import React, { useState, useEffect } from 'react';
import ForgeReconciler, {
  Form,
  Label,
  Text,
  Textfield,
  useForm,
  FormSection,
  FormFooter,
  LoadingButton,
  Button,
  ButtonGroup,
  Inline,
  Icon,
  Lozenge,
  Select,
  Stack,
  Box,
  xcss
} from "@forge/react";
import { view } from '@forge/bridge';
import { DEFAULT_CONFIGURATION } from '../data/default_config';



const ContextConfig = () => {
  const [extensionData, setExtensionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [configuration, setConfiguration] = useState(() => ({...DEFAULT_CONFIGURATION}));
  const [progressList, setProgressList] = useState(null);
  const { handleSubmit, register, getFieldId, getValues, trigger } = useForm();

  const containerStyles = xcss({
    width: '70%',
  });

  const progressEditStyles = xcss({
    width: '30%'
  });

  const ragEditStyles = xcss({
    width: '20%'
  }); 
  const boldEditStyles = xcss({
    width: '20%'
  }); 

  //console.log("Configuration", configuration);



  useEffect(() => {
    view.getContext().then(({ extension }) => {
      setExtensionData(extension);

      if (extension.configuration) {
        setConfiguration(extension.configuration);
      }
    });
  }, []);

  const addProgress = () => {
    setIsLoading(true);
    let copy = configuration;
    const {new_status, new_rag, new_bold} = getValues();
    //console.log("new rag:", new_rag)

    copy.progressList.push({label:new_status ? new_status : "New progress", rag:new_rag ? new_rag.value : "undefined", isbold:new_bold ? new_bold.value : 0, value:Math.max(...configuration?.progressList.map(item => item.value))+1}, );
    setConfiguration(copy);
    setIsLoading(false);
  };

  const deleteRow = (index) => {
    setIsLoading(true);
    let copy = configuration
    copy.progressList = copy.progressList.filter((e) => e.value !== index);

    setConfiguration(copy);
    setIsLoading(false);
    const values = getValues();
      //console.log("submit values:", values);
    trigger();
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await view.submit({configuration: configuration});
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  }

  if (!extensionData) {
    return <Textfield>Loading...</Textfield>;
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormSection>
        <Text>Available progress statuses</Text>
        {configuration?.progressList && configuration?.progressList?.map((option, index) => (

          
            
            <Inline space="space.200">
              <Box paddingBlockEnd="space.100" xcss={containerStyles}>
                <Lozenge appearance={option?.rag ? option?.rag : "default"} isBold={option?.isbold && option?.isbold === 1 ? true : false}> 
                  {option?.label ? option.label : "Unknown"} 
                </Lozenge>
              </Box>
              <Box xcss={ragEditStyles} paddingBlockEnd="space.100" paddingInline = "space.300"> 
                <Button onClick={() => deleteRow(option?.value)} appearance = "subtle"> 
                  Delete
                </Button>
              </Box>
            </Inline>

        ))}  
            <Inline space="space.200">
              <Box paddingBlockEnd="space.100" xcss={progressEditStyles}>
                <Textfield {...register('new_status')} defaultValue="New progress"/> 
              </Box>
              <Box paddingBlockEnd="space.100" xcss={ragEditStyles}>
                <Select {...register('new_rag')} 
                  options  = {configuration?.ragList?.map((option) => (
                    {value: option.value, label: option.label}
                  ))}
                  defaultValue ={{value:"default", label:"Grey"}}
                />
              </Box>
              <Box paddingBlockEnd="space.100" xcss={boldEditStyles}>
                <Select 
                  {...register('new_bold') }
                  options={[
                    {value: 0, label: "No"},
                    {value: 1, label: "Yes"}]
                  }
                  defaultValue={{
                    value: 0,
                    label: "No"
                  }}
                />
              </Box>
              <Box xcss={ragEditStyles} padpaddingBlockEnddingBlock="space.100">
                <Button onClick={() => addProgress()} appearance = "subtle">Add</Button>
              </Box>
            </Inline>
        
      </FormSection>
      <FormFooter >
        <ButtonGroup appearance="primary">
          <Box xss={containerStyles}>
            <Button appearance="subtle" onClick={view.close}>Close</Button>
            <LoadingButton appearance="primary" type="submit" isLoading={isLoading}>
              Submit
            </LoadingButton>
          </Box>
        </ButtonGroup>

      </FormFooter>
    </Form>
  )
}

ForgeReconciler.render(
  <React.StrictMode>
    <ContextConfig />
  </React.StrictMode>
);
