// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Teams/');
    self.displayName = 'NBA Team Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Acronym = ko.observable('');
    self.Name = ko.observable('');
    self.Logo = ko.observable('');
    self.City = ko.observable('');
    self.StateName = ko.observable('');
    self.ConferenceName= ko.observable('');
    self.DivisionName= ko.observable('');
    self.History= ko.observable('');
    self.Seasons = ko.observableArray([]);
    self.Players = ko.observableArray([]);
    self.VisiblePlayers = ko.observableArray([]);

    //--- Page Events
    self.activate = function (id, acronym) {
        console.log('CALL: getTeam...');
        console.log('Acronym:', acronym)
        var composedUri = self.baseUri() + id + '?Acronym=' + (acronym || '');
        console.log(composedUri)
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log('Data received: ', data);
            hideLoading();
            if (data) {
                self.Id(data.Id);
                self.Acronym(data.Acronym)
                self.Name(data.Name);
                self.Logo(data.Logo);
                self.City(data.City);
                self.StateName(data.StateName);
                self.ConferenceName(data.ConferenceName);
                self.DivisionName(data.DivisionName);
                self.History(data.History);
                self.Seasons(data.Seasons);
                self.Players(data.Players);
                self.VisiblePlayers(self.Players().slice(0, 10));
                // Show the "Show More" button if there are more than 15 players
                if (self.Players().length > 10) {
                    document.getElementById('showMore').style.display = 'block';
                }
            } else {
                console.error('Received undefined or null data.')
            }
            
        });
    };

    // Add a new function to show more players
    self.showMore = function () {
        var nextPlayers = self.Players().slice(self.VisiblePlayers().length, self.VisiblePlayers().length + 5);
        self.VisiblePlayers(self.VisiblePlayers().concat(nextPlayers));

        // Hide the "Show More" button if all players are displayed
        if (self.VisiblePlayers().length === self.Players().length) {
            document.getElementById('showMore').style.display = 'none';
        }
    };

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function showLoading() {
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var pgId = getUrlParameter('id');
    var pgAcronym = getUrlParameter('acronym');
    console.log('ID: ', pgId);
    console.log('Acronym: ', pgAcronym);
    if (pgId == undefined)
        self.activate(1, 'DEFAULT');
    else {
        self.activate(pgId, pgAcronym);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("document.ready!");
    var viewModel = new vm();
    ko.applyBindings(viewModel);

    // Add an event listener to the "Show More" button
    document.getElementById('showMore').addEventListener('click', function () {
        viewModel.showMore();
    });
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})