const file_name = process.argv[2]
console.log(file_name)
var pattern = /.cpp$/g
var test = file_name.match(pattern)
if (!test){
    console.log('invalid file')
}else{
    var fname = file_name.split('.cpp')[0]
    console.log(fname)
}
