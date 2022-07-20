

  // Gets the content of a text file using XHR.
  function getContent(url, type='text') {

    if (typeof url == 'string') {
      return fetch(url).then(res => {
        if (!res.ok)
          throw new Error(`Request to '${url}' failed`);

        if (type === 'arraybuffer')
          return res.arrayBuffer();
        else if (type === 'blob')
          return res.blob();
        else if (type === 'json')
          return res.json();
        else if (type === 'formData')
          return res.formData();
        return res.text();
      });
    }

    else if (Array.isArray(url))
      return Promise.all(url.map(u => getContent(u, binary)));

    else
      throw new TypeError('FileManager.getContent: argument 1 must be a string or array of strings representing a valid url.');

  }

  export function saveBlob(blob, fileName = '') {
    const downloadLink = document.createElement('a')
    const tempURL = URL.createObjectURL(blob)
    
    downloadLink.href = tempURL
    downloadLink.setAttribute('download', fileName)
    downloadLink.style.display = 'none'
    
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    
    URL.revokeObjectURL(tempURL)
  }

  function readFile(file, type = 'text') {
    return new Promise((resolve, reject) => {
      
      const reader = new FileReader()
      
      reader.onload = () => {
        resolve(reader.result)
      }
      
      reader.onerror = () => {
        reject(new Error('Error while reading file from input.'))
      }
      
      switch (type) {
        case 'text': reader.readAsText(file, 'UTF-8'); break
        case 'arraybuffer': reader.readAsArrayBuffer(file); break
        case 'dataurl': reader.readAsDataURL(file); break
        default: reject(new Error('Invalid read format'))
      }
      
    })
  }


  // Opens a file through the "Send file" dialog.
  export function openFile({accept, multiple, readAs } = {}) {
    return new Promise((resolve, reject) => {
      
      let input = document.createElement('input')
      input.type = 'file'
      input.hidden = true
      input.accept = accept
      input.multiple = !!multiple
      
      input.onchange = () => {
        
        let files = Array.from(input.files)
        
        if (!multiple) {
          readFile(files[0], readAs).then(resolve, reject)
        } else {
          Promise.all(
            files.map((file) => readFile(file, readAs))
          ).then(resolve, reject)
        }
        
      }
      
      document.body.appendChild(input)
      input.click()
      input.remove()
    });
  }

  function processResponseLines(responseText) {
    let lines = responseText.split(/\r?\n/);
    let files = [], base = './';
    lines.forEach(line => {
      let tokens = line.split(' ');
      if (tokens[0] === '300:') {
        base = tokens[1];
      }
      else if (tokens[0] === '201:'){
        files.push({
          name: tokens[1],
          path: base + tokens[1],
          length: Number(tokens[2]),
          lastModified: new Date(decodeURI(tokens[3])),
          type: tokens[4]
        });
      }
    });
    return files;
  }

  function getDirectoryListing(path, recurse) {

    async function readDir(path) {
      let itemsDescription = await getContent(path);
      let items = processResponseLines(itemsDescription);
      if (recurse) {
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          if (item.type === 'DIRECTORY') {
            let subItems = await readDir(item.path);
            items.splice(i, 1, ...subItems);
          }
        }
      }
      return items;
    }

    if (typeof path === 'string')
      return readDir(path);
    else if (Array.isArray(path))
      return Promise.all(path.map(readDir));
    else
      throw new Error('Argument 1 of getDirectoryListing is not a string or Array of valid URLs');

  }

