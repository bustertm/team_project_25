pipeline {
	agent any

	stages {
		stage('build') {
			steps {
				sh 'pwd'
				sh 'ls'
				sh 'cd TP_webApp/TP_webApp/'
				sh 'dotnet build TP_webApp.csproj'
				sh '../../node_modules/.bin/webpack --config ../../webpack.config.js'
			}
		}
	}
}