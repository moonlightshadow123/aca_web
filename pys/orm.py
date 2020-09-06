from peewee import *
import datetime,json,copy
timeformat = "%Y/%m/%d %H:%M:%S"

db = SqliteDatabase('aca.db')
db.pragma('foreign_keys', 1, permanent=True)
# db.connect()

class JSONField(TextField):
    def db_value(self, value):
        return json.dumps(value)

    def python_value(self, value):
        if value is not None:
            return json.loads(value)

class BaseModel(Model):
    class Meta:
        database = db

class Tag(BaseModel):
	name = CharField(unique=True)

class Entry(BaseModel):
	# tag = ForeignKeyField(Tag, backref='entry', null=True)
	json = JSONField(default=[])
	last_update = DateTimeField(null=True)

class EntryTag(BaseModel):
	entry = ForeignKeyField(Entry, backref='ets', on_delete='CASCADE')
	tag = ForeignKeyField(Tag, backref='ets', on_delete='CASCADE')

#'''
# print(b.content[1])
# '''

# Tags
def createTag(name):
	new_id = Tag.create(name=name)
	return new_id

def createTags(names):
	ids = [createTag(name) for name in names]
	return ids

def getTags():
	res = []
	query = Tag.select()
	for tag in query:
		res.append({"id": tag.id, "text":tag.name})
	return {"results":res}

def deleteTag(id):
	num = Tag.delete().where(Tag.id == id).execute()
	return num

# Entry
def createEntry(jsonobj):
	new_id = Entry.create(json=jsonobj, last_update=datetime.datetime.now())
	return new_id

def deleteEntry(id):
	num = Entry.delete().where(Entry.id == id).execute()
	return num

def updateEntry(id, jsonobj):
	num = Entry.update(json=jsonobj, last_update=datetime.datetime.now()).where(Entry.id == id).execute()
	return num

def getEntrys():
	res = []
	query = Entry.select()
	for entry in query:
		res.append({"id":entry.id, "name":entry.json})
	return res

# EntryTag
def createETs(entryid, tagids):
	res = []
	entry = Entry.get(Entry.id == entryid)
	for id in tagids:
		tag = Tag.get(Tag.id == id)
		res.append(EntryTag.create(entry=entry, tag=tag))
	return res

def deleteETs(entryid, tagids):
	res = 0
	entry = Entry.get(Entry.id == entryid)
	for id in tagids:
		tag = Tag.get(Tag.id == id)
		res += EntryTag.delete().where(EntryTag.entry==entry, EntryTag.tag==tag).execute()
	return res

def updateETs(entryid, tagids):
	res = getTagByEntry(entryid)
	cur_tagids = [each["id"] for each in res]
	for id in copy.copy(tagids):
		if id in cur_tagids:
			tagids.remove(id)
			cur_tagids.remove(id)
	# remove current
	deleteETs(entryid, cur_tagids)
	# add new
	createETs(entryid, tagids) 

def getTagByEntry(entryid):
	res = []
	query = Tag.select(Tag.id,Tag.name).join(EntryTag).join(Entry).where(Entry.id==entryid).execute()
	for tag in query:
		res.append({"id": tag.id, "name":tag.name})
	return res

def getEntryByTags(tagids):
	res = []
	# print(tagids)
	if "0" in tagids or 0 in tagids: # All Entries
		query = Entry.select(Entry.id, Entry.json).execute()
	else:
		query = Entry.select(Entry.id, Entry.json).join(EntryTag).join(Tag).where(Tag.id.in_(tagids)).execute()
	for entry in query:
		tags = getTagByEntry(entry.id)
		# print("id = {}".format(entry.id))
		res.append({"id": entry.id, "json":entry.json
					,"tagids":[tag["id"] for tag in tags]
					,"tags": [tag["name"] for tag in tags]})
	return res

def buildContent(jsonobj):
	res = [""]
	#string = ""
	for each in jsonobj:
		if type(each) == str:
			for i in range(len(res)):
				res[i] += " " + each
		if type(each) == list:
			new_res = []
			for string in res:
				for suffix in each:
					new_res.append(string + " " + suffix)
			res = new_res
	return res

def hasContent(jsonobj, content):
	res = buildContent(jsonobj)
	# print(res)
	for each in res:
		if content in each:
			return True
	return False

def query(tagids, content):
	res = []
	entrys = getEntryByTags(tagids)
	for entry in entrys:
		if hasContent(entry["json"], content):
			res.append(entry)
	# print(res)
	return res

if __name__ == "__main__":
	'''
	# print(createTag("Created Tag3!"))
	db.create_tables([Tag, Entry, EntryTag])

	a = Tag.create(name='My first tag')
	b = Entry.create(json=[["nihao", "hello"], "world"])
	c = EntryTag.create(entry=b, tag=a)
	Tag.create(name='tag2')
	Tag.create(name='tag3')
	updateETs(1,[2,3])
	print(getTags())
	print(deleteTag(3))
	# updateETs(1,[2,3])
		'''
	# print(getTagByEntry(2))
	#print(getEntryByTags([1,2]))
	# print(getTags())

	print(query([1,2], "earth"))