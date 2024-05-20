
export default class hash
{
    static md5(input: string): string
    {
        // Constants defined for MD5 algorithm
        const rotateLeft = (x: number, n: number): number => (x << n) | (x >>> (32 - n));
        const FF = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
            a += ((b & c) | (~b & d)) + x + ac;
            a = rotateLeft(a, s);
            return a + b;
        };
        const GG = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
            a += ((b & d) | (c & ~d)) + x + ac;
            a = rotateLeft(a, s);
            return a + b;
        };
        const HH = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
            a += (b ^ c ^ d) + x + ac;
            a = rotateLeft(a, s);
            return a + b;
        };
        const II = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number => {
            a += (c ^ (b | ~d)) + x + ac;
            a = rotateLeft(a, s);
            return a + b;
        };

        // Initialize variables
        let a = 0x67452301;
        let b = 0xefcdab89;
        let c = 0x98badcfe;
        let d = 0x10325476;

        // Convert input to UTF-8
        input = decodeURIComponent(encodeURIComponent(input));

        // Append padding
        input += String.fromCharCode(0x80);
        let originalLength = input.length * 8;

        while (input.length % 64 !== 56) {
            input += String.fromCharCode(0);
        }

        input += String.fromCharCode(originalLength & 0xFF);
        input += String.fromCharCode((originalLength >>> 8) & 0xFF);
        input += String.fromCharCode((originalLength >>> 16) & 0xFF);
        input += String.fromCharCode((originalLength >>> 24) & 0xFF);

        // Process the message in successive 512-bit chunks
        for (let i = 0; i < input.length; i += 64) {
            let aTemp = a;
            let bTemp = b;
            let cTemp = c;
            let dTemp = d;

            let chunk = input.substring(i, i + 64);

            // Main loop
            let f, g;
            for (let j = 0; j < 64; j++) {
                if (j < 16) {
                    f = FF(bTemp, cTemp, dTemp, aTemp, parseInt(chunk.substring(j * 4, (j * 4) + 4), 16), [7, 12, 17, 22][j % 4], [0xD76AA478, 0xE8C7B756, 0x242070DB, 0xC1BDCEEE][Math.floor(j / 16)]);
                    g = j;
                } else if (j < 32) {
                    f = GG(bTemp, cTemp, dTemp, aTemp, parseInt(chunk.substring((j * 4) % 64, ((j * 4) % 64) + 4), 16), [5, 9, 14, 20][j % 4], [0xF61E2562, 0xC040B340, 0x265E5A51, 0xE9B6C7AA][Math.floor(j / 16)]);
                    g = (5 * j + 1) % 16;
                } else if (j < 48) {
                    f = HH(bTemp, cTemp, dTemp, aTemp, parseInt(chunk.substring((j * 4) % 64, ((j * 4) % 64) + 4), 16), [4, 11, 16, 23][j % 4], [0x02441453, 0xD8A1E681, 0xE7D3FBC8, 0x21E1CDE6][Math.floor(j / 16)]);
                    g = (3 * j + 5) % 16;
                } else {
                    f = II(bTemp, cTemp, dTemp, aTemp, parseInt(chunk.substring((j * 4) % 64, ((j * 4) % 64) + 4), 16), [6, 10, 15, 21][j % 4], [0xC33707D6, 0xF4D50D87, 0x455A14ED, 0xA9E3E905][Math.floor(j / 16)]);
                    g = (7 * j) % 16;
                }
                let dTemp2 = dTemp;
                dTemp = cTemp;
                cTemp = bTemp;
                bTemp = bTemp + rotateLeft((aTemp + f) & 0xFFFFFFFF, [7, 12, 17, 22][j % 4]);
                aTemp = dTemp2;
            }

            // Update variables
            a = (a + aTemp) & 0xFFFFFFFF;
            b = (b + bTemp) & 0xFFFFFFFF;
            c = (c + cTemp) & 0xFFFFFFFF;
            d = (d + dTemp) & 0xFFFFFFFF;
        }

        // Combine outputs
        let result = '';
        result += ('0' + (a >>> 0).toString(16)).slice(-8);
        result += ('0' + (b >>> 0).toString(16)).slice(-8);
        result += ('0' + (c >>> 0).toString(16)).slice(-8);
        result += ('0' + (d >>> 0).toString(16)).slice(-8);
        
        return result;
    }
}