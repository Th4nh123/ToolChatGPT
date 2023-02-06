import { KEY_API_TRANS } from './base';

import React, { useEffect, useState } from 'react';
import translate from "translate";


const Convert2 = (props) => {
    const { text, target, source } = props;
    const [convertedText, setConvertedText] = useState('');
    console.log(text.length);

    useEffect(()=> {
        translate.engine = "google"; // Or "yandex", "libre", "deepl"
        translate.key = process.env.KEY_API_TRANS;
    
        const textTrans = translate(text, { from: source, to: target });
        textTrans.then(async rs => {
            await translate(rs, { from: target, to: source })
                .then(rs2 => {
                    console.log(rs2.length);
                    setConvertedText(rs2);
                })
        })
    },[text, target, source])
    return <h3>{convertedText}</h3>
};

export default Convert2;
