from http.server import HTTPServer, BaseHTTPRequestHandler
from sklearn import tree
import sys

# open the data dump file
file = open('C:\\Users\\xmymo\\Documents\\ts-wow\\coredata\\realms\\tswow\\data')

# split using the separator
rawdata = file.read().split(';')

file.close()

labels = []
arr = []

def RepresentsNum(s):
    return s.isnumeric()
    
# find the threat (last number in line) and add it as a label
for entry in rawdata:
    label = entry[1+entry.rfind(','):]

    if RepresentsNum(label):
        labels.append(int(label))
    else:
        rawdata.remove(entry)

data = []

# find the threat again but remove it from the string
for entry in rawdata:
    # "firstpart,secondpart,threat" becomes "firstpart,secondpart"
    # then appended into the data list
    index = entry.rfind(',')
    data.append(entry[:index])

features = []

for entry in data:
    split = entry.split(',')
    newentry = []
    for sub in split:
        newentry.append(int(sub))
    features.append(newentry)

# print(data)
# print(rawdata)
# print(labels)
# print(features)

# Features
# Class ID	Dmg Dealt	Stat 3	Stat 4	Stat 5	Stat 6	Stat 7	Stat 12	Stat 13	Stat 14	Stat 15	Stat 31	Stat 32	Stat 33	Stat 34	Stat 38	Stat 39	Stat 41
#	Stat 42	Stat 44	Stat 45	Stat 46	Stat 47	Stat 48

# Labels
# Threat

clf = tree.DecisionTreeClassifier()
clf = clf.fit(features, labels)

def DoPredict(myArgs):
    arr = myArgs
    print(len(arr))
    classId = int(arr[0]);
    dmgDealt = int(arr[1]);
    stat3 = int(arr[2]);
    stat4 = int(arr[3]);
    stat5 = int(arr[4]);
    stat6 = int(arr[5]);
    stat7 = int(arr[6]);
    stat12 = int(arr[7]);
    stat13 = int(arr[8]);
    stat14 = int(arr[9]);
    stat15 = int(arr[10]);
    stat31 = int(arr[11]);
    stat32 = int(arr[12]);
    stat33 = int(arr[13]);
    stat34 = int(arr[14]);
    stat38 = int(arr[15]);
    stat39 = int(arr[16]);
    stat41 = int(arr[17]);
    stat42 = int(arr[18]);
    stat44 = int(arr[19]);
    stat45 = int(arr[20]);
    stat46 = int(arr[21]);
    stat47 = int(arr[22]);
    stat48 = int(arr[23]);
    
    return clf.predict([[classId, dmgDealt, stat3, stat4, stat5, stat6, stat7, stat12, stat13, stat14, stat15, stat31,
                        stat32, stat33, stat34, stat38, stat39, stat41, stat42, stat44, stat45, stat46, stat47, stat48]])

class MyRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        # self.path contains a '/' as a first character and then 
        # all our arguments comma separated.
        arr = self.path[1:].split(',')
        result = DoPredict(arr)
        self.wfile.write(bytearray(str(result[0]).encode()))


httpd = HTTPServer(('localhost', 5555), MyRequestHandler)
httpd.serve_forever()