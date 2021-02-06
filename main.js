const element = (tag, classes = [], content) => {
    const node = document.createElement(tag);

    if(classes.length){
        node.classList.add(...classes);
    }
    if(content){
        node.textContent = content;
    }

    return node;
};

function noop() {}

export function upload(selector, options = {}) {
    let files = [];
    const onUpload = options.onUpload ?? noop;
    const inputs = document.querySelector(selector);

    const preview = element('div', ['preview']);
    const open_btn = element('button', ['container__btn'], 'Open');
    const clean_btn = element('button', ['container__btn', 'primary'], 'Clean');
    const upload_btn = element('button', ['container__btn', 'primary'], 'Upload');

    clean_btn.style.display = 'none';
    upload_btn.style.display = 'none';

    clean_btn.addEventListener('click', (event) =>{
        preview.innerHTML = '';
        
        clean_btn.style.display = 'none';
        upload_btn.style.display = 'none';
        
    });

    if(options.multi) {
        inputs.setAttribute('multiple', true);
    }

    if(options.accept && Array.isArray(options.accept)) {
        inputs.setAttribute('accept', options.accept.join(','));
    }

    inputs.insertAdjacentElement('afterend', preview);
    inputs.insertAdjacentElement('afterend', upload_btn);
    inputs.insertAdjacentElement('afterend', clean_btn);
    inputs.insertAdjacentElement('afterend', open_btn);
    

    const inputGo = () => inputs.click();

    const changeHandler = event => {
        const target = event.target;

        if (!target.files.length){
            return;
        }

        files = Array.from(target.files); // приводим к массиву

        clean_btn.style.display = 'inline';
        upload_btn.style.display = 'inline';

            files.forEach(file =>{
                if(!file.type.match('image')) { //проверяем на "кaртинку"
                    return;
                }

            const reader = new FileReader(); //Объект FileReader позволяет веб-приложениям асинхронно читать содержимое файлов

            reader.onload = e => {
                const src = e.target.result;
                preview.insertAdjacentHTML('afterbegin', `
                    <div class='preview__image'>
                        <div class='preview__remove data-name='${file.name}'>&times;</div>
                        <img src='${src}' alt='${file.name}' />
                        <div class='preview__info'>
                            <span>${file.name.split('.')[0]}</span> 
                        </div>
                    </div> 
                `); // здесь вставили кусок html о картинке. В span обрезали имя до расширения. имя получили из event.target
            },

            reader.readAsDataURL(file);  //по завершении, аттрибут result будет содержать данные файла в виде data: URL
        });
    };

    const removeHandler = ev =>{
        if(ev.target && ev.target.classList.contains('preview__remove')){
            ev.target.parentElement.remove();
        }
    };

    const clearPreview = (el) => {
        el.style.bottom = '4px';
        el.innerHTML = '<div class="preview__info_progress"></div>';
    };

    const uploadHandler = (ev) =>{
        preview.querySelectorAll('.preview__remove').forEach(e => e.remove());
        const previewInfo = preview.querySelectorAll('.preview__info');
        previewInfo.forEach(clearPreview);
        onUpload(files, previewInfo);
    };
    
    open_btn.addEventListener('click', inputGo);
    inputs.addEventListener('change', changeHandler);
    preview.addEventListener('click', removeHandler);
    upload_btn.addEventListener('click', uploadHandler);
}
