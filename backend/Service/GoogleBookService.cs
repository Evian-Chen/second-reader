using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using backend.Dto.GoogleBook;
using backend.Interface;

namespace backend.Service
{
    public class GoogleBookService : IGoogleBookService
    {
        private readonly HttpClient _http;
        public GoogleBookService(HttpClient http)
        {
            _http = http;
        }

        public async Task<GoogleBookResultDto?> GetByIsbnAsync(string isbn)
        {
            var url = $"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}";
            var json = await _http.GetFromJsonAsync<JsonElement>(url);
            if (!json.TryGetProperty("items", out var items) ||
                items.GetArrayLength() == 0)
                return null;
            
            var volumeInfo = items[0].GetProperty("volumeInfo");
            return new GoogleBookResultDto
            {
                Title = volumeInfo.GetProperty("title").GetString(),
                Authors = volumeInfo.TryGetProperty("authors", out var authors) ? authors.EnumerateArray()
                        .Select(a => a.GetString()!)
                        .Where(a => !string.IsNullOrWhiteSpace(a))
                        .ToList()
                    : new List<string>(),                
                ISBN = isbn,
                PreviewLink = volumeInfo.GetProperty("previewLink").GetString()
            };
        }
    }
}