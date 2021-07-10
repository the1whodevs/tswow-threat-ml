from sklearn import tree
import sys

def DoPredict(args):
    
    return 'suck on this dick'

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
    
    classId = int(args[1]);
    dmgDealt = int(args[2]);
    stat3 = int(args[3]);
    stat4 = int(args[4]);
    stat5 = int(args[5]);
    stat6 = int(args[6]);
    stat7 = int(args[7]);
    stat12 = int(args[8]);
    stat13 = int(args[9]);
    stat14 = int(args[10]);
    stat15 = int(args[11]);
    stat31 = int(args[12]);
    stat32 = int(args[13]);
    stat33 = int(args[14]);
    stat34 = int(args[15]);
    stat38 = int(args[16]);
    stat39 = int(args[17]);
    stat41 = int(args[18]);
    stat42 = int(args[19]);
    stat44 = int(args[20]);
    stat45 = int(args[21]);
    stat46 = int(args[22]);
    stat47 = int(args[23]);
    stat48 = int(args[24]);
    
    return (clf.predict([[classId, dmgDealt, stat3, stat4, stat5, stat6, stat7, stat12, stat13, stat14, stat15, stat31,
                        stat32, stat33, stat34, stat38, stat39, stat41, stat42, stat44, stat45, stat46, stat47, stat48]]))

print(DoPredict(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5],sys.argv[6],sys.argv[7],sys.argv[8],sys.argv[9],sys.argv[10],sys.argv[11],sys.argv[12],sys.argv[13],
                sys.argv[14],sys.argv[15],sys.argv[16],sys.argv[17],sys.argv[18],sys.argv[19],sys.argv[20],sys.argv[21],sys.argv[22],sys.argv[23],sys.argv[24]))