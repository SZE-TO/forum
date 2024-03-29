import React from 'react';

import ReactMarkdown from 'react-markdown';
import { Editor } from 'react-draft-wysiwyg';

import * as CONFIG from '../../constants/config/config';
import * as APIKEY from '../../constants/apikey';

import classes from './CommentTextarea.module.css';
import Button from '../UI/Button/Button';

const CommentTextarea = (props) => {

    const classList = [classes.PostCommentBox]
    if (!props.valid) {
        classList.push(classes.Invalid)
    }

    const uploadImage = (file) => {
        return new Promise((resolve,reject) => {
            const formData = new FormData();
            formData.append('source', file)
            fetch(`https://imgst.art/api/1/upload/?key=${APIKEY.CHEVERETO_API_KEY}&format=json`, {
                method: 'POST',
                body: formData
            }).then((response) => {
                return response.json()
            }).then((responseData) => {
                resolve({data: {link: responseData.image.url}})
            }).catch(error => {
                reject('error:', error)
            })
        })
    }

    const blockStyle = (contentBlock) => {
        const type = contentBlock.getType();
        if (type === 'blockquote') {
          return classes.Blockquote;
        }
      }

    return (
        <React.Fragment>
            {CONFIG.USE_SIMPLE_EDITOR ?
                <form onKeyPress={props.keyPress}>
                    <div style={{ "position": "relative", "marginBottom": "15px" }}>
                        {!props.preview ?
                            <React.Fragment>
                                <textarea
                                    className={classList}
                                    value={props.text}
                                    onChange={props.changeHandler}
                                    placeholder="輸入你的想法..." />
                                <p className={classes.Remark}>(可使用<a href="https://markdown.tw/" target="_blank" rel="noopener noreferrer">Markdown</a>語法)</p>
                            </React.Fragment>
                            :
                            <div className={classes.PreviewBox}>
                                <ReactMarkdown source={props.text} />
                            </div>
                        }
                    </div>
                    <Button type={"Warning"} onClick={props.previewHandler}>{props.preview ? '編輯' : '預覽'}</Button>
                    <Button type={"Success"} onClick={props.submitHandler} disabled={props.disableSubmitButton}>發表</Button>
                </form>
                :
                <React.Fragment>
                    <Editor
                        wrapperClassName={classes.Wrapper}
                        editorClassName={classes.Editor}
                        editorState={props.editorState}
                        editorRef={props.setEditorReference}
                        onEditorStateChange={props.onEditorStateChange}
                        placeholder={"輸入你的想法..."}
                        blockStyleFn={blockStyle}
                        localization={{
                            locale: 'zh_tw'
                        }}
                        toolbar={{
                            options: ['inline', 'blockType', 'list', 'link', 'emoji', 'image', 'history'],
                            inline: {
                                inDropdown: false,
                                className: undefined,
                                component: undefined,
                                dropdownClassName: undefined,
                                options: ['bold', 'italic', 'strikethrough', 'monospace'],
                            },
                            image: {
                                className: undefined,
                                component: undefined,
                                popupClassName: undefined,
                                urlEnabled: true,
                                uploadEnabled: true,
                                alignmentEnabled: false,
                                uploadCallback: (file) => uploadImage(file),
                                previewImage: true,
                                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                                alt: { present: false, mandatory: false },
                                defaultSize: {
                                    height: 'auto',
                                    width: 'auto',
                                }
                            }
                        }}
                    />
                    <Button type={"Success"} onClick={props.submitHandler} disabled={props.disableSubmitButton}>發表</Button>
                </React.Fragment>
            }
        </React.Fragment>
    )
}

export default CommentTextarea;
