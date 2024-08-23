import React, { useState, useEffect } from 'react';
import ForgeReconciler, {
  Lozenge,
  Text,
} from "@forge/react";
import { view } from '@forge/bridge';
import { DEFAULT_CONFIGURATION } from '../data/default_config';

const View = () => {
  const [extension, setExtension] = useState(null);


  useEffect(() => {
    view.getContext().then((context) => { 
      let extension = context.extension;
      extension.configuration = extension?.configuration || {...DEFAULT_CONFIGURATION}  
      setExtension(extension);

    });
  }, []);


  return (
    <>
      <Lozenge appearance={extension?.configuration?.ragList?.find((element) => element?.label === extension?.fieldValue?.rag)?.value ||'default'} isBold = {extension?.fieldValue?.bold===1 ? true : false} >
        {extension?.fieldValue?.progress || 'Undefined'}
      </Lozenge>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <View />
  </React.StrictMode>
);
