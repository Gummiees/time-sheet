import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  generateId(length: number = 5): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  getBase64Image(img: HTMLImageElement): string | undefined {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.drawImage(img, 0, 0);
    const url = canvas.toDataURL('image/png');
    if (!url || url === 'data:,') {
      return;
    }
    return url;
  }

  isNullOrEmpty(value: string): boolean {
    return this.isNullOrUndefined(value) || value.trim() === '';
  }

  isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  toArray(enumType: any): string[] {
    return Object.keys(enumType)
      .filter((key) => isNaN(enumType[key]))
      .map((key) => enumType[key]);
  }
}
