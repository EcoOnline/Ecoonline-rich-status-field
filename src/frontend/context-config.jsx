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
  Stack,
  Box
} from "@forge/react";
import { view } from '@forge/bridge';
import { DEFAULT_CONFIGURATION } from '../data/default_config';

const ContextConfig = () => {
  const [extensionData, setExtensionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [configuration, setConfiguration] = useState(() => ({...DEFAULT_CONFIGURATION}));
  const [progressList, setProgressList] = useState(null);
  const { handleSubmit, register, getFieldId, getValues, trigger } = useForm();

  console.log("Configuration", configuration);

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
    let copy = configuration
    copy.progressList.push({label:undefined, value:Math.max(...configuration?.progressList.map(item => item.value))+1});
    setConfiguration(copy);
    setIsLoading(false);
  };

  const changeProgress = (index) => {
    setIsLoading(true);
    let copy = configuration
    copy.progressList.find()
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
      console.log("submit values:", values);
    trigger();
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      let copy = configuration;
      const formValues = getValues();
      console.log("submit values:", formValues);
      
      const updatedProgressList = configuration?.progressList.map(item => {
        // Find the corresponding progress status in form values by matching the progress.value attribute
        const inputValue = formValues["edit_"+item?.value];
        if (inputValue !== undefined) {
          return { ...item, label: inputValue };
        }
        return item;
      }).filter(item => item?.label !== undefined);
      console.log("updatedProgressList", updatedProgressList);
      copy.progressList = updatedProgressList;
      console.log("updated config: ", copy);
      await view.submit({configuration: copy});
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
        {configuration?.progressList && configuration?.progressList.map((option, index) => (

          <Box paddingBlock="space.100">
            
            <Inline space="space.200">
                <Textfield value= {option.label} isDisabled></Textfield> 
                <Icon glyph="edit" label = "Change status to"/>
                <Textfield {...register("edit_"+option.value)} />
                <Button onClick={() => deleteRow(option.value)} appearance = "subtle"> 
                  <Icon glyph="trash" label="Delete" />
                </Button>
            </Inline>
          </Box>
        ))}
        <Button onClick={() => addProgress()}>Add</Button>
      </FormSection>
      <FormFooter >
        <ButtonGroup>
          <Button appearance="subtle" onClick={view.close}>Close</Button>
          <LoadingButton appearance="primary" type="submit" isLoading={isLoading}>
            Submit
          </LoadingButton>
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
