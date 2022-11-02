const isTwoDigitNum = (value) => {
    return /^\d\d$/.test(value)
}

class TLV {
    constructor(tag, length, value) {
        this.tag = tag;
        this.length = length;
        this.value = value;
        const {tlvs, ok} = TLV.Parse(value);
        this.hasChild = ok;
        this.children = tlvs;
    }

    toObject() {
        const result = {
            tag: this.tag,
            length: this.length,
            value: this.value,
        }

        if (this.hasChild) {
            result.children = this.children.map((el) => el.toObject())
        }
        return result;
    }

    /**
     * @param {string} s
     */

    static getTagAndLength(s) {
        if (s.length != 4) {
            return {ok: false}
        }
       
        const tagStr = s.substring(0, 2);
        const lenStr = s.substring(2, 4);

        if (!isTwoDigitNum(tagStr) || !isTwoDigitNum(lenStr)){
            return {ok: false}
        }

        return {
            tag: tagStr,
            len: parseInt(lenStr),
            ok: true,
        };
    } 


    /**
     * 
     * @param {string} rawText 
     * @returns {object}
     */
    static Parse(rawText) {
        const tlvs = []
        var ptr = 0;
        const rawLen = rawText.length;

        if (rawLen < 4) {
            return {ok: false};
        }

        while ((ptr + 4) <= rawLen) {
            const {tag, len, ok} = TLV.getTagAndLength(rawText.substring(ptr, ptr+4))
            if (!ok || (ptr + 4 + len) > rawLen) {
                return {ok: false};
            }

            const tlv = new TLV(tag, len, rawText.substring(ptr + 4, ptr + 4 + len))
            tlvs.push(tlv)
            ptr = ptr + 4 + len
        }

        return {
          tlvs: tlvs,
          ok: true,  
        };
    }

    /**
     * 
     * @param {string} rawText 
     * @return {object} 
     */
    static GetAsObjects(rawText) {
        const {tlvs, ok} = TLV.Parse(rawText)
        if (!ok) {
            return {ok: false};
        }
        return {result: tlvs.map((el) => el.toObject()), ok: true}
    }
}

const qrisPayload = "00020101021126650013ID.CO.BCA.WWW011893600014000094045502150008850009404550303UMI51440014ID.CO.QRIS.WWW0215ID20200340732190303UMI5204821153033605802ID5921YAY KASIH PENGHARAPAN6008SURABAYA61056019562070703A01630424E2";
const {result, ok} = TLV.GetAsObjects(qrisPayload);
console.log({result, ok});