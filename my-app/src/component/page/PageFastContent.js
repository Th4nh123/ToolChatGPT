import '../../css/style_fast_content.css'
import $ from "jquery";
import useState from 'react-usestateref'
import Tinymce from '../libs/Tinymce'
import { Const_Libs } from '../libs/Const_Libs';



export default function PageFastContent() {
    var [state, setState, ref] = useState("<p>Text here.............</p>")
    const [Content, setCentent] = useState({
        noidung: 'Nhập câu hỏi ở đây',
    });

    const handleTest = () => {
        $('.spin-get-answer').removeClass('d-none')
        $('.get-answer').text('Đang lấy câu trả lời')
        console.log(document.querySelector("textarea"));
        console.log(Content);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer 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");

        var raw = JSON.stringify({
            "model": "text-davinci-003",
            "prompt": Content.noidung,
            "max_tokens": 100,
            "temperature": 0,
            "logprobs": 10
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://api.openai.com/v1/completions", requestOptions)
            .then(response => response.text())
            .then(async result => {
                let answer = JSON.parse(result)
                console.log(answer);
                setState(answer.choices[0].text)
                $('.spin-get-answer').addClass('d-none')
                $('.get-answer').html('Lấy câu trả lời')
                Const_Libs.TOAST.success("Hoàn thành")
            })
            .catch(error => console.log('error', error));
    }

    return (
        <section id="FastContent">
            <div className="fast-container">
                <div className="row">
                    <div className="fast-left col-5">
                        <div className="m-1">
                            <button type="button" className="btn btn-primary p-2">Delete link</button>
                            <div className="fast-left-container">
                                <div className="fast-delete">
                                    <div className="delete-select ">
                                        <textarea
                                            style={{ width: "100%", height: "500px", padding: "10px" }}
                                            onChange={(e) => setCentent({ ...Content, noidung: e.target.value })}
                                        >

                                        </textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fast-right  col-7">
                        <div>
                            <div className="fast-right-button">
                                <button className="btn btn-primary p-2" type="button" onClick={handleTest}>
                                    <span className="spinner-border spinner-border-sm d-none  spin-get-answer" style={{ marginRight: '10px' }}></span>
                                    <span className='get-answer'>Lấy câu trả lời</span>
                                </button>
                            </div>
                            <div className="right-container-fast">
                                <div>
                                    <h5 className="fs-6 fw-bolder mb-2">Nội dung bài viết</h5>
                                    <div className="fast-delete">
                                        <div className="delete-select ">

                                            <Tinymce answer={state} />

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div></section>
    )
}