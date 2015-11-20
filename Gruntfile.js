module.exports = function(grunt) {
    
    grunt.initConfig({
      pkg_dev: grunt.file.readJSON("./secret/dashboard_dev_scheduler.json"),
      
      sshexec: {
            uptime: {
              command: "uptime",
              options: {
                host: '<%= pkg.host %>',
                port: '<%= pkg.port %>',
                username: '<%= pkg.username %>',   
                privateKey: grunt.file.read("./secret/App-staging-Node.pem")

              }
            },


          deploy:{
              command: [
                'echo "Login to remote :"',   
                '[ -d ~/current/ ] || mkdir current',
                'cd current/',
                '[ -d sequelize_auditor_example/ ] || sudo git clone https://github.com/propulsionio/sequelize_auditor_example.git',
                'cd sequelize_auditor_example/',
                'sudo git pull origin master',
                'sudo npm install',
				///'sudo pm2 stop sequelize_demo',
				'sudo pm2 start app.js --name="sequelize_demo"'
              ].join(' && '),
              options: {
                host: '<%= pkg_dev.host %>',
                port: '<%= pkg_dev.port %>',
                username: '<%= pkg_dev.username %>',
                privateKey: grunt.file.read("./secret/Dashboard-dev-scheduler.pem")

              }
           }
      }  
  });

  // Load the plugin that provides the "sshexec" task.
  grunt.loadNpmTasks('grunt-ssh');

  // Default task.
  grunt.registerTask('default', ['sshexec:uptime']);
  grunt.registerTask('deploy', ['sshexec:deploy']); 
};