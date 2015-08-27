// JavaScript source code
function ColonyManager(data)
{
    var that = this;

    //Attributes
    this._mice = [];
    this._miceDict = {};
    this._groups = [];

    //constructorion
    this.constructor = function (data)
    {
        //this.loadColony(JSON.parse(data));
    }

    //Methods
    if (typeof this._initialized == "undefined")
    {
        this.createColony = function (data)
        {
            //$http.get
        }

        this.loadColony = function (data)
        {
            for (var i = 0, l = data.length; i < l; i++) {
                this.addGroup(data[i]);
            }
            //console.log(this._groups);

            for (var i = 0, l = this._groups.length; i < l; i++) {
                this._mice = this._mice.concat(this._groups[i]._mice);
            }
            //console.log(this._mice);

            for (var i = 0, l = this._mice.length; i < l; i++) {
                this._miceDict[this._mice[i]._mouseId] = this._mice[i];
            }
            //console.log(this._miceDict);

            for (var i = 0, l = this._mice.length; i < l; i++) {
                this._mice[i].link(that);
                //console.log(this._mice[i]._childs);
            }
        }

        this.selectGroup = function (groupId)
        {

        }

        this.addGroup = function (group)
        {
            this._groups.push(new ColonyGroup(group));
        }

        this.buildLineageTree = function (mouseId)
        {
            var m = this._miceDict[mouseId];
            console.log(m._mouseId);
            if (m._motherId) this.buildLineageTree(m._motherId);
            if (m._fatherId) this.buildLineageTree(m._fatherId);
            for (var i = 0, l = m._childIds.length; i < l; i++) {
                this.buildLineageTree(m._childIds)
            }
            
        }

        this._initialized = true;
    }

    //Call constructor
    this.constructor(data);
}

function ColonyGroup(data)
{
    var that = this;

    //Attributes
    this._mice = [];

    //Constructor
    this.constructor = function (data)
    {
        if (data)
        {
            for (var i = 0, l = data.length; i < l; i++) {
                this._mice.push(new ColonyMouse(data[i]));
            }
        }
        else
        {
            console.log("Empty group generated!");
        }
    }

    //Methods
    if (typeof this._initialized == "undefined") {

        this.addMouse = function (manager, mouseId)
        {
            this._mice.push(manager._miceDict[mouseId]);
        }

        this._initialized = true;
    }

    //Call constructor
    this.constructor(data);
}

// JavaScript source code
function ColonyMouse(data)
{
    var that = this;

    //Attributes
    this._mouseId = -1;
    this._gender = "";
    this._litter = -1;

    this._dob = "";
    this._dobYear = "";
    this._dobMonth = "";
    this._dobDay = "";

    this._gene1 = "";
    this._gene2 = "";
    this._gene3 = "";
    this._genotype1 = "";
    this._genotype2 = "";
    this._genotype3 = "";

    this._generation = -1;
    this._fatherId = "";
    this._motherId = "";

    this._childIds = [];
    this._lineage = {};

    this._childs = [];
    this._father = {};
    this._mother = {};

    //constructorion
    this.constructor = function (data)
    {
        this._mouseId = data.mouseId;
        this._gender = data.gender;
        this._litter = data.litter;

        this._dob = data.dob;
        this._dobYear = data.dobYear;
        this._dobMonth = data.dobMonth;
        this._dobDay = data.dobDay;

        this._gene1 = data.gene1;
        this._gene2 = data.gene2;
        this._gene3 = data.gene3;
        this._genotype1 = data.genotype1;
        this._genotype2 = data.genotype2;
        this._genotype3 = data.genotype3;

        this._generation = data.generation;
        this._fatherId = data.fatherId;
        this._motherId = data.motherId;

        this._numOffSpring = data.numOffSpring;
        this._childIds = data.childIds;
        this._lineage = data.lineage;
    }

    //Methods
    if (typeof this._initialized == "undefined")
    {
        //Properties
        this.MouseId = function (value)
        {
            if (!arguments.length) return this._mouseId;
            this._mouseId = value;
            return this;
        }

        this.Gender = function (value)
        {
            if (!arguments.length) return this._gender;
            this._gender = value;
            return this;
        }

        this._updateDob = function ()
        {
            //var re = /(\d{4})(\d{2})(\d{2})/g;
            //var result = re.exec(this._dob);
            //if (result != null && result.length > 4) {
            //    this._dobYear = +result[1];
            //    this._dobMonth = +result[2];
            //    this._dobDay = +result[3];
            //}
            //else {
            //    console.log('Parse failed!');
            //}
        }

        this.DateOfBirth = function (value)
        {
            if (!arguments.length) return this._dob;
            this._dob = value;
            this._updateDob();
            return this;
        }

        this.Litter = function (value)
        {
            if (!arguments.length) return this._litter;
            this._litter = value;
            return this;
        }

        this.Gene1 = function (value)
        {
            if (!arguments.length) return this._gene1;
            this._gene1 = value;
            return this;
        }

        this.Gene2 = function (value)
        {
            if (!arguments.length) return this._gene2;
            this._gene2 = value;
            return this;
        }

        this.Gene3 = function (value)
        {
            if (!arguments.length) return this._gene3;
            this._gene3 = value;
            return this;
        }

        this.Genotype1 = function (value)
        {
            if (!arguments.length) return this._genotype1;
            this._genotype1 = value;
            return this;
        }

        this.Genotype2 = function (value)
        {
            if (!arguments.length) return this._genotype2;
            this._genotype2 = value;
            return this;
        }

        this.Genotype3 = function (value)
        {
            if (!arguments.length) return this._genotype3;
            this._genotype3 = value;
            return this;
        }

        this.Generation = function (value)
        {
            if (!arguments.length) return this._generation;
            this._generation = value;
            return this;
        }

        this.MotherId = function (value)
        {
            if (!arguments.length) return this._motherId;
            this._motherId = value;
            return this;
        }

        this.FatherId = function (value)
        {
            if (!arguments.length) return this._fatherId;
            this._fatherId = value;
            return this;
        }

        this.Lineage = function (value)
        {
            if (!arguments.length) return this._lineage;
            this._lineage = value;
            return this;
        }

        //Methods
        this.link = function (manager)
        {
            for(var i = 0, l = this._childIds.length; i < l; i++)
            {
                this._childs.push(manager._miceDict[this._childIds[i]]);
                this._mother = manager._miceDict[this._motherId];
                this._father = manager._miceDict[this._fatherId];
            }
        }

        this.Output = function ()
        {

        }

        this._initialized = true;
    }

    //Call constructor
    this.constructor(data);
}

var colonyManager = new ColonyManager();
//m._dob = '20150418';
//m._updateDob();