using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Util
{
    /// <summary>
    /// Random method
    /// </summary>
    public static class Random
    {
        private readonly static System.Random random = new System.Random();
        public static string RandomStringGenerator(int len)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, len)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}