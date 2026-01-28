using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using backend.Interface;
using Clerk.BackendAPI.Models.Components;
using TesseractOCR;
using TesseractOCR.Enums;

namespace backend.Service
{
    public class OcrService : IOcrService
    {
        private readonly string _tessdataPath;
        public OcrService()
        {
            _tessdataPath = Path.Combine(AppContext.BaseDirectory, "tessdata");
        }

        public async Task<string?> ExtractIsbnAsync(IFormFile img)
        {
            var text = await ExtractTextAsync(img);
            return IsbnExtractor.TryExtractIsbn(text);
        }

        public async Task<string> ExtractTextAsync(IFormFile img)
        {
            if (img == null || img.Length == 0) throw new Exception("img is required.");

            byte[] bytes;
            await using (var ms = new MemoryStream())
            {
                await img.CopyToAsync(ms);
                bytes = ms.ToArray();
            }

            using var engine = new Engine(_tessdataPath, Language.English, EngineMode.Default);
            using var pix = TesseractOCR.Pix.Image.LoadFromMemory(bytes);
            using var page = engine.Process(pix);
            return (page.Text ?? string.Empty).Trim();
        }
    }
    internal static class IsbnExtractor
    {
        // 抓出可能的 ISBN（允許空白/破折號）
        private static readonly Regex Isbn13Like =
            new Regex(@"97[89][-\s]?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?\d",
                RegexOptions.Compiled);

        private static readonly Regex Isbn10Like =
            new Regex(@"\b\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?[\dXx]\b",
                RegexOptions.Compiled);

        public static string? TryExtractIsbn(string rawText)
        {
            if (string.IsNullOrWhiteSpace(rawText)) return null;

            // 常見 OCR 誤判：把 O 當 0，把 I/l 當 1（ISBN 常見）
            var normalized = rawText
                .Replace('O', '0')
                .Replace('o', '0')
                .Replace('I', '1')
                .Replace('l', '1');

            // 先找 ISBN-13
            var m13 = Isbn13Like.Match(normalized);
            if (m13.Success)
            {
                var digits = StripToDigits(m13.Value);
                if (digits.Length == 13 && IsValidIsbn13(digits))
                    return digits;
            }

            // 再找 ISBN-10（必要時轉 13）
            var m10 = Isbn10Like.Match(normalized);
            if (m10.Success)
            {
                var compact = StripToDigitsAndX(m10.Value).ToUpperInvariant();
                if (compact.Length == 10 && IsValidIsbn10(compact))
                {
                    // 你也可以選擇回傳 ISBN-10；這裡示範回傳轉成 ISBN-13
                    var isbn13 = ConvertIsbn10To13(compact);
                    return isbn13;
                }
            }

            return null;
        }

        private static string StripToDigits(string s) =>
            new string(s.Where(char.IsDigit).ToArray());

        private static string StripToDigitsAndX(string s) =>
            new string(s.Where(c => char.IsDigit(c) || c == 'X' || c == 'x').ToArray());

        // ISBN-13 檢查碼
        private static bool IsValidIsbn13(string digits13)
        {
            int sum = 0;
            for (int i = 0; i < 12; i++)
            {
                int d = digits13[i] - '0';
                sum += (i % 2 == 0) ? d : d * 3;
            }
            int check = (10 - (sum % 10)) % 10;
            return check == (digits13[12] - '0');
        }

        // ISBN-10 檢查碼
        private static bool IsValidIsbn10(string s10)
        {
            int sum = 0;
            for (int i = 0; i < 9; i++)
            {
                if (!char.IsDigit(s10[i])) return false;
                sum += (i + 1) * (s10[i] - '0');
            }

            int last = s10[9] == 'X' ? 10 : (char.IsDigit(s10[9]) ? s10[9] - '0' : -1);
            if (last < 0) return false;

            sum += 10 * last;
            return sum % 11 == 0;
        }

        private static string ConvertIsbn10To13(string isbn10)
        {
            // prefix 978 + first 9 digits of isbn10
            var base12 = "978" + isbn10.Substring(0, 9);
            int sum = 0;
            for (int i = 0; i < 12; i++)
            {
                int d = base12[i] - '0';
                sum += (i % 2 == 0) ? d : d * 3;
            }
            int check = (10 - (sum % 10)) % 10;
            return base12 + check.ToString();
        }
    }
}