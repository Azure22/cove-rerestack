// JavaScript source code
function ColonyManager()
{
    var that = this;

    //Attributes
    this._mice = {};

    //constructorion
    this.constructor = function ()
    {

    }

    //Methods
    if (typeof this._initialized == "undefined")
    {
        this.createColony = function (data)
        {
            $http.get
        }

        this.loadColony = function (data)
        {

        }

        this.selectMouse = function (mouseId)
        {

        }

        this.addMouse = function (mouseId)
        {
            if (!(mouseId in this._mice)) {
                var newMouse = new ColonyMouse();
                this._mice[this._mice.length] = newMouse;
            }
            else {
                console.log(mouseId + " exists!");
            }
        }

        this.removeMouse = function (mouseId)
        {
            if (mouseId in this._mice) {
                this._mice.splice(this._mice.indexOf(mouseId), 1);
            }
            else {
                console.log(mouseId + " doesn't exist!");
            }
        }

        this._initialized = true;
    }

    //Call constructor
    this.constructor();
}

// JavaScript source code
function ColonyMouse()
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
    this._numOffSpring = 0;
    this._childIds = [];
    this._lineage = {};

    //constructorion
    this.constructor = function ()
    {

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
            var re = /(\d{4})(\d{2})(\d{2})/g;
            var result = re.exec(this._dob);
            if (result != null && result.length > 4) {
                this._dobYear = +result[1];
                this._dobMonth = +result[2];
                this._dobDay = +result[3];
            }
            else {
                console.log('Parse failed!');
            }
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
        this.addChild = function (mouseId)
        {
            if (!(mouseId in this._childIds)) {
                this._numOffSpring += 1;
                this._childIds[this._childIds.length] = mouseId;
            }
            else {
                console.log(mouseId + " exists!");
            }
        }

        this.removeChild = function (mouseId)
        {
            if (mouseId in this._childIds) {
                this._numOffSpring -= 1;
                this._childIds.splice(this._childIds.indexOf(mouseId), 1);
            }
            else {
                console.log(mouseId + " doesn't exist!");
            }
        }

        this.Output = function ()
        {

        }

        this._initialized = true;
    }

    //Call constructor
    this.constructor();
}

var m = new ColonyMouse();
m._dob = '20150418';
m._updateDob();