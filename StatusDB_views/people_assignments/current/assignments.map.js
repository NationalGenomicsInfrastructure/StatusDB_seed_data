function (doc) {
    var currentPeople = [];
    for (var personId in doc.people) {
        var assignments = doc.people[personId];
        if (Array.isArray(assignments) && assignments.length > 0) {
            const lastAssignment = assignments[assignments.length - 1];
            
            // If the last assignment is not removed, add the person ID to the result
            if (lastAssignment && lastAssignment.removed === false) {
                currentPeople.push(personId);
            }
        }
    }
    emit(doc._id, currentPeople);
}