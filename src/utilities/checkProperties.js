const checkProperties = function (obj, property, operator, value) {
    try {
        let ref = parseFloat(obj[property]);
        if (isNaN(ref)) {
            ref = obj[property];
        }
        else value = parseFloat(value);
        switch (operator) {
            case '==':
                return ref == value;
            case '!=':
                return ref != value;
            case '<=':
                return ref <= value;
            case '>=':
                return ref >= value;
            case '<':
                return ref < value;
            case '>':
                return ref > value;
        }

    }
    catch (err) {
        return false;
    }
}

export default checkProperties;