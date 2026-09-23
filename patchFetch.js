const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/input/page.tsx', 'utf8');

const newLoop = `      // Convert base64 to Blob safely
      const dataURLtoBlob = (dataurl: string) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
      };

      for (let i = 0; i < photos.length; i++) {
        const blob = dataURLtoBlob(photos[i]);
        formData.append("photos", blob, \`photo_\${i}.jpg\`);
      }`;

content = content.replace(/      for \(let i = 0; i < photos\.length; i\+\+\) \{[\s\S]*?formData\.append\("photos", blob, `photo_\$\{i\}\.jpg`\);\n      \}/, newLoop);
fs.writeFileSync('src/app/(dashboard)/input/page.tsx', content);
