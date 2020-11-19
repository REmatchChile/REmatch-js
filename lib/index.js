const Module = require('./rematch_wasm.js');

const { RegEx, RegExOptions } = Module;

let early_output;
let line_by_line;
let multi_line;
let dot_nl;
let save_anchors;

// Regex object
class Regex {
  constructor(pattern, options) {
    this.pattern = pattern
    this.rgx_object = new RegEx(pattern)
    this.options = options
  }
  find(string) {
    let rgx = new RegEx(this.pattern, this.options);
    let result = new Match(rgx.findIter(string));
    if (result.obj == null) {
        return null
      }
    result.str = string
    return result
  }

  *findIter(string) {
    let iter;
    let match;
    iter = this.rgx_object.findIter(string);
    while (iter.hasNext()) {
      match = new Match(iter.next())
      yield match
    }
    return null
  }

  match(string) {
    throw new Error('Method not available')
    this.options.save_anchors = true
    let rgx = new RegEx(this.pattern, this.options);
    let m = new Match(rgx.find(string));
    if (m.group(0) == string.slice(0, m.group(0).length + 1)) {
      return m
    }
    return null

  }
  search(string) {
    let rgx = new RegEx(this.pattern, this.options);
    let result = new Match(rgx.findIter(string));
    if (result.obj == null) {
        return null
      }
    result.str = string
    return result
  }

  fullmatch(string) {
    throw new Error('Method not available')
    this.options.save_anchors = true
    let rgx = new RegEx(this.pattern, this.options);
    let m = new Match(rgx.find(string));
    if (m.group(0) == string) {
      return m
    }
    return null
  }
  findall(string) {
    let vector = [];
    let match;
    while (match = this.rgx_object.findIter(string)) {
      match = new Match(match)
      vector.push(match);
    }
    return vector
  }
}

//  Match object
class Match {
  constructor(obj) {
    this.obj = obj
    this.str = null
  }
  convert(varb) {
    if (Number.isInteger(varb)) {
      return this.obj.variables().get(varb);
    }
    return varb
  }
  start(varb) {
    varb = this.convert(varb);
    return this.span(varb)[0]
  }
  end(varb) {
    varb = this.convert(varb);
    return this.span(varb)[1]
  }
  span(varb) {
    varb = this.convert(varb);
    return this.obj.span(varb);
  }
  group(varb) {
    varb = this.convert(varb);
    return this.str.slice(this.start(varb), this.end(varb))
  }
  groups() {
    let content = [];
    let vars = this.obj.variables();
    for (let i = 0; i < vars.size(); i++) {
      const varb = vars.get(i);
      content.push(this.group(varb))
    }
    return content
  }
  groupdict() {
    let dic = {};
    let vars = this.obj.variables();
    for (let i = 0; i < vars.size(); i++) {
      const varb = vars.get(i);
      dic[varb] = this.group(varb);
    }
    return dic
  }

}


//  Compile
const compile = function (pattern, ...flags) {
  let rgxOptions = new RegExOptions();
  if (multi_line) {
    console.warn('Flags are not available')
    rgxOptions.multi_line = true;
  }
  if (early_output) {
    console.warn('Flags are not available')
    rgxOptions.early_output = true;
  }
  if (line_by_line) {
    console.warn('Flags are not available')
    rgxOptions.line_by_line = true;
  }
  if (dot_nl) {
    console.warn('Flags are not available')
    rgxOptions.dot_nl = true;
  }
  if (save_anchors) {
    console.warn('Flags are not available')
    rgxOptions.save_anchors = true;
  }

  let rgx = new Regex(pattern, rgxOptions);
  return rgx
}

//  Direct methods
const find = function (pattern, string, ...flags) {
  let rgx = compile(pattern, ...flags);
  return rgx.find(string)
}
const search = function (pattern, string, ...flags) {
  let rgx = compile(pattern, ...flags);
  return rgx.search(string)
}
const findall = function (pattern, string, ...flags) {
  let rgx = compile(pattern, ...flags);
  return rgx.findall(string)
}
const findIter = function (pattern, string, ...flags) {
  let rgx = compile(pattern, ...flags);
  return rgx.findIter(string)
}
const match = function (pattern, string, ...flags) {
  let rgx = compile(pattern, ...flags);
  return rgx.match(string)
}
const fullmatch = function (pattern, string, ...flags) {
  let rgx = compile(pattern, ...flags);
  return rgx.fullmatch(string)
}

module.exports = {
  compile: compile,
  match: match,
  fullmatch: fullmatch,
  findIter: findIter,
  findall: findall,
  find: find,
  search: search
}
