from sklearn import tree

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
# Class ID	Dmg Dealt	Stat 3	Stat 4	Stat 5	Stat 6	Stat 7	Stat 12	Stat 13	Stat 14	Stat 15	Stat 31	Stat 32	Stat 33	Stat 34	Stat 38	Stat 39	Stat 41	Stat 42	Stat 44	Stat 45	Stat 46	Stat 47	Stat 48

# Labels
# Threat


clf = tree.DecisionTreeClassifier()
clf = clf.fit(features, labels)
print(clf.predict([[1,200,25,31,1109393408,1095761920,1109393408,0,0,0,1999,0,0,0,0,301989888,226,0,51,0,1093657216,1094653440,0,0]]))