var app = angular.module('registrationApp', []);

// Service for API interactions
app.service('RegistrationService', ['$http', function($http) {
    const apiUrl = 'http://localhost:5000/api/registrations';

    this.getAllRegistrations = function() {
        return $http.get(apiUrl);
    };

    this.createRegistration = function(data) {
        return $http.post(apiUrl, data);
    };

    this.updateRegistration = function(id, data) {
        return $http.put(`${apiUrl}/${id}`, data);
    };

    this.deleteRegistration = function(id) {
        return $http.delete(`${apiUrl}/${id}`);
    };
}]);

// Factory for shared utilities
app.factory('UtilsFactory', function() {
    return {
        formatPhone: function(phoneNumber) {
            if (!phoneNumber) return '';
            return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        },
        validateEmail: function(email) {
            const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            return EMAIL_REGEX.test(email);
        }
    };
});

// Filter for phone number formatting (uses the factory)
app.filter('formatPhone', ['UtilsFactory', function(UtilsFactory) {
    return function(phoneNumber) {
        return UtilsFactory.formatPhone(phoneNumber);
    };
}]);

// Custom Search Filter
app.filter('customSearch', function() {
    return function(registrations, searchQuery) {
        if (!searchQuery) {
            return registrations;
        }

        // Convert search query to lowercase for case-insensitive matching
        var query = searchQuery.toLowerCase();

        return registrations.filter(function(registration) {
            return registration.name.toLowerCase().includes(query) || 
                   registration.email.toLowerCase().includes(query);
        });
    };
});

// Main Controller
app.controller('MainController', ['$scope', 'RegistrationService', 'UtilsFactory', function($scope, RegistrationService, UtilsFactory) {
    $scope.registrations = [];
    $scope.registration = {};
    $scope.editMode = false;
    $scope.message = '';
    $scope.searchQuery = '';

    // Fetch registrations
    $scope.loadRegistrations = function() {
        RegistrationService.getAllRegistrations()
            .then((response) => {
                $scope.registrations = response.data;
            })
            .catch(() => {
                $scope.message = 'Error: Unable to fetch registrations.';
            });
    };

    // Add or update registration
    $scope.handleSubmit = function() {
        const updatedData = {
            name: $scope.registration.name,
            email: $scope.registration.email,
            phone: $scope.registration.phone,
            age: $scope.registration.age, // Include age
            date: $scope.registration.date // Include date
        };

        if ($scope.editMode) {
            RegistrationService.updateRegistration($scope.registration._id, updatedData)
                .then(() => {
                    $scope.message = 'Registration updated successfully!';
                    $scope.loadRegistrations();
                    $scope.cancelEdit();
                })
                .catch(() => {
                    $scope.message = 'Error: Unable to update registration.';
                });
        } else {
            RegistrationService.createRegistration(updatedData) // Include date
                .then(() => {
                    $scope.message = 'Registration successful!';
                    $scope.loadRegistrations();
                    $scope.registration = {};
                })
                .catch(() => {
                    $scope.message = 'Error: Unable to register.';
                });
        }
    };

    // Edit registration
    $scope.editRegistration = function(registration) {
        $scope.registration = angular.copy(registration);  // Create a copy of the registration
        $scope.editMode = true;
    };

    // Cancel edit
    $scope.cancelEdit = function() {
        $scope.registration = {};
        $scope.editMode = false;
        $scope.message = '';
    };

    // Delete registration
    $scope.deleteRegistration = function(id) {
        RegistrationService.deleteRegistration(id)
            .then(() => {
                $scope.message = 'Registration deleted successfully!';
                $scope.loadRegistrations();
            })
            .catch(() => {
                $scope.message = 'Error: Unable to delete registration.';
            });
    };

    // Email validation using UtilsFactory
    $scope.isValidEmail = function(email) {
        return UtilsFactory.validateEmail(email);
    };

    // Load data initially
    $scope.loadRegistrations();
}]);

// Directive for email validation
app.directive('validEmail', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$validators.validEmail = function(modelValue) {
                const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                return EMAIL_REGEX.test(modelValue);
            };
        }
    };
});
