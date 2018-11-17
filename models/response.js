
module.exports = Response;

function Response(code, err, data)
{
    this.status = code;
    this.errorMessage = (err)? err : "";
    this.responseData = (data)? data : "";
}
