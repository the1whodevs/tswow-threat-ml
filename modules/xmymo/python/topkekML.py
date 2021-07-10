from sklearn import tree
import sys

# open the data dump file
file = open('C:\\Users\\xmymo\\Documents\\ts-wow\\coredata\\realms\\tswow\\data')

# split using the separator
rawdata = file.read().split(';')

file.close()

labels = []

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

classId = int(sys.argv[1]);
dmgDealt = int(sys.argv[2]);
stat3 = int(sys.argv[3]);
stat4 = int(sys.argv[4]);
stat5 = int(sys.argv[5]);
stat6 = int(sys.argv[6]);
stat7 = int(sys.argv[7]);
stat12 = int(sys.argv[8]);
stat13 = int(sys.argv[9]);
stat14 = int(sys.argv[10]);
stat15 = int(sys.argv[11]);
stat31 = int(sys.argv[12]);
stat32 = int(sys.argv[13]);
stat33 = int(sys.argv[14]);
stat34 = int(sys.argv[15]);
stat38 = int(sys.argv[16]);
stat39 = int(sys.argv[17]);
stat41 = int(sys.argv[18]);
stat42 = int(sys.argv[19]);
stat44 = int(sys.argv[20]);
stat45 = int(sys.argv[21]);
stat46 = int(sys.argv[22]);
stat47 = int(sys.argv[23]);
stat48 = int(sys.argv[24]);

print(clf.predict([[classId, dmgDealt, stat3, stat4, stat5, stat6, stat7, stat12, stat13, stat14, stat15, stat31,
                    stat32, stat33, stat34, stat38, stat39, stat41, stat42, stat44, stat45, stat46, stat47, stat48]]))