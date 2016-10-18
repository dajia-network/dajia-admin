# 把dajia数据库替换成dajia_test
application_properties=`find src -name application.properties -print`

sed 's/3306\/dajia\?/3306\/dajia_test\?/g' $application_properties > /tmp/sed.a
mv /tmp/sed.a $application_properties

echo ""
echo ""
echo ""
echo "###################################################################"
cat avatar.txt
echo ""
echo "###################################################################"
echo ""
echo ""
                                                     
mvn -X clean spring-boot:run -Drun.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=9000"

