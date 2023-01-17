from flask import Flask, render_template, request, url_for, send_file, redirect
from werkzeug.utils import secure_filename
from pymongo import MongoClient as mdb
from bson.objectid import ObjectId
import random, string


db = mdb("mongodb://localhost:27017/").pyshare.files
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024 *1024   # 5GB


@app.route('/')
def index():
    return render_template('./index.html')
	
@app.route('/upload', methods = ['POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['file']   
        print(f.content_length)
        path = f'uploads/{"".join(random.choices(string.digits+string.ascii_letters, k=32))}'
        data = db.insert_one({"name":secure_filename(f.filename),"path":path,"password":"0","donwloads":0})
        f.save(path)
        return f"{request.url_root}download/{data.inserted_id}".replace("http://","https://")

    
@app.route('/download/<id>',methods = ['GET','POST'])
def download_file(id):
    fileData = db.find_one({"_id":ObjectId(id)})
    db.update_one({"_id":ObjectId(id)}, {"$set": {"donwloads":fileData["donwloads"]+1}})
    return send_file(fileData["path"], as_attachment=True, download_name=fileData["name"])

@app.route('/arc-sw.js',methods = ['GET','POST'])
def arc():
    return send_file('./arc-sw.js')

if __name__ == '__main__':
   app.run(debug = True, host='0.0.0.0')