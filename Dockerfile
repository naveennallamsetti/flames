FROM tomcat:10.1-jdk21-temurin

RUN rm -rf /usr/local/tomcat/webapps/*
COPY target/flames-calculator.war /usr/local/tomcat/webapps/ROOT.war
