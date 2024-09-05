import { AbstractControl, ValidationErrors } from '@angular/forms';

export function restrictedWords1(control: AbstractControl): ValidationErrors | null {
  // control can a be FormControl or a FromGroup
  // ValidationErrors: 一个对象，包含由失败的验证所生成的那些错误
  //   (alias) type ValidationErrors = {
  //     [key: string]: any;
  // }
  // 返回后会与其他validationerrors进行merge
  return control.value.includes('foo') ? { restrictedWords: true } : null;
}

export function restrictedWords(words: string[]) {
  return (control: AbstractControl): ValidationErrors | null => {
    const invalidWords = words.map(w => (control.value.includes(w) ? w : null)).filter(w => w !== null);
    return invalidWords.length > 0 ? { restrictedWords: invalidWords.join(', ') } : null;
  };

  // 返回值为any任何都行，不一定要为true
}
