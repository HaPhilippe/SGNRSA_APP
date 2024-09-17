export default function subText (text = '', max = 15, jumpSpace = true, sep='...') {
          if(!text) return ""
          if(text.length < max || (jumpSpace && (text.indexOf(" ", max) === -1))) return text
          return jumpSpace ? text.substr(0, text.indexOf(" ", max))+sep : text.substr(0, max)+sep
}