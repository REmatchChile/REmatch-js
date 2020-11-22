const REmatch = require('../lib')
const fs = require('fs');
const { strict, match } = require('assert');
let expect    = require("chai").expect;

try {

    function limpiar(spanners_file) {
      // console.log(spanners_file)
      let r = spanners_file.trim();
      // console.log(r)
      
    
      r = r.replace(/\t/g, '');
      r = r.replace(/\r/g, '');
      r = r.replace(/\n/g, '');

      r = r.replace(/ /g, '');
   
    
      r = r.split('>');
      let vars = {}
      let vars_l = []
      r.forEach(str => {
        if (!(str == '')) {
          
          str = str.split('=|');
          let vari = str[0];
          let span = str[1].split(',')
          span = Array.from(span, x => parseInt(x))
          // console.log(vari, span)
          
          
          if (vars_l.includes(vari)) {
            vars[vari].push(span)
          }
          else {
            vars_l.push(vari);
            vars[vari] = [span]
          }

        }
        
      })
      // console.log(vars)
      vars_l.forEach(vari => {
        // console.log(vari)
        vars[vari].sort(function(lista1, lista2) {return lista1[0]-lista2[0]});
      })
      // console.log(vars)
      if (vars_l.length == 0) {
        return null
      }
        
      
      return vars
   
    }
    // const s = "x = |0,1>    x = |0,2>    x = |0,3>     x = |0,4>	    x = |0,5>	"
    // console.log(limpiar(s));


    function getDirectories(path) {
      return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path+'/'+file).isDirectory();
      });
    }

    tests_folders = getDirectories(__dirname +'/test_input_regex_file')
    // tests_folders = ['test_first_and_last_element3']

    tests_folders.forEach((folder) => {


        describe('Testing all methods ' + folder, function() {


            let doc = fs.readFileSync(__dirname +'/test_input_regex_file/' + folder + '/document.txt', "latin1");
            let rgx = fs.readFileSync(__dirname +'/test_input_regex_file/' + folder + '/regex.txt', "latin1");
            let spanners = fs.readFileSync(__dirname +'/test_input_regex_file/' + folder + '/spanners.txt', "latin1");
            spanners = limpiar(spanners);
            let rgx1 = REmatch.compile(rgx);
            it('should test find method for document ' + folder, function() {
            
            let result = rgx1.find(doc)
            // console.log(spanners)
            if (result != null) {
              result = result.span('x');
              // console.log(result)
              expect(result).to.eql(spanners['x'][0])
            }
            else {
              expect(result).to.eql(spanners)
            }

          })



            it('should test findIter method for document ' + folder, function() {

              // let rgx1 = REmatch.compile(rgx);
              let r_finditer = {}
              let vars_l_test = [];

              for (let result of rgx1.findIter(doc)) {

                let result_dic = result.groupdict()
                // console.log(result_dic)
                for (let varb in result_dic) {
                  // console.log(vars_l_test.includes(varb), varb, vars_l_test)
                  if (vars_l_test.includes(varb)) {
                    r_finditer[varb].push(result.span(varb))
                  }
                  else {
                    r_finditer[varb] = [result.span(varb)]
                    vars_l_test.push(varb)
                  }
                  
                }
              
              }
              // console.log(r_finditer)
              vars_l_test.forEach(vari => {
                // console.log(vari)
                r_finditer[vari].sort(function(lista1, lista2) {return lista1[0]-lista2[0]});
              })
              // console.log(r_finditer)
              vars_l_test.forEach(varb => {
                 for(let i = 0; i < r_finditer[varb].length; i++){
                    // console.log('findIter: ', r_finditer[varb], varb)
                    // console.log('spanners: ', spanners[varb][i], varb)
                    expect(r_finditer[varb]).to.deep.include(spanners[varb][i])
                  }
              })


              


            })

            it('should test findAll method for document ' + folder, function() {


              let list = rgx1.findall(doc);

              if (list !== null) {
                list.sort(function(macth1, match2) {return macth1.span('x')[0]-match2.span('x')[0]});
                // console.log(list)
                let r_findall = {}
                let vars_l_test = [];
                list.forEach(match => {

                  let result_dic = match.groupdict()
                  // console.log(result_dic)
                  for (let varb in result_dic) {
                    // console.log(vars_l_test.includes(varb), varb, vars_l_test)
                    if (vars_l_test.includes(varb)) {
                      r_findall[varb].push(match.span(varb))
                    }
                    else {
                      r_findall[varb] = [match.span(varb)]
                      vars_l_test.push(varb)
                    }
                    
                  }
                
                })

                vars_l_test.forEach(vari => {
                  // console.log(vari)
                  r_findall[vari].sort(function(lista1, lista2) {return lista1[0]-lista2[0]});
                })
                // console.log(r_finditer)
                vars_l_test.forEach(varb => {
                  for(let i = 0; i < r_findall[varb].length; i++){
                      // console.log(r_finditer[i])
                      expect(r_findall[varb]).to.deep.include(spanners[varb][i])
                    }
                })
              }
              else {
                expect(list).to.eql(spanners)
              }


          })
        });
      });


    
  // describe('rematchjs', function() {
  //   describe('#find()', function() {
  //     it('should return the span of a word', function() {
  //       const text = 'Lorem ipsum dolor sit amet consectetur adipiscing elit';
  //       let rgx = REmatch.compile('.*!word{dolor}.*');
  //       const result = rgx.find(text).span('word');
  //       expect(result).to.eql([12, 16]);
  //     })
  //   }

  // tests que fallan 
              
              // folder == 'test_the_whole_document2'
              
              // folder == 'test_the_whole_document1'
              
              // folder == 'test_specific_element1'
            
              // folder == 'test_nested_disjunction1'
            
              // first y last element fallan la mayoria 
              // y uno de concat_adv falla en find()

} catch (error) {
    console.log('Error:', error)
};
