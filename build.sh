#!/bin/bash
FILE=../build/eJianLian-web.tar.gz
buildnumberfile="buildnumber"
changelogfile="changelogs.txt"
echo "开始构建壹建联......" 

# Step 1 清理
rm -f $FILE

# Step 2 下载最新代码
git reset --hard HEAD
git pull

# Step 3 从 buildnumber 文件中读取上次 build 的时间和 build number
read -d $"\x04" builddatenum < "$buildnumberfile" 
# parse the line using (,)
IFS="," a=($builddatenum);  builddate=${a[0]}, buildnum=${a[1]}
echo "上次build时间为： $builddate"
echo "上次build的编号： $buildnum"

# Step 4 真正的创建 build
startbuild=$( date "+%Y-%m-%d %H:%M:%S" )
meteor npm install --save bcrypt
meteor npm install --production
meteor build ../build --architecture os.linux.x86_64

# Step 5 将创建成功的文件拷贝到远程
if [ -f $FILE ]; then
 
   # Step 6 通知用户本次build的改动
   newbuildnum=$(( $buildnum + 1 ))
   newbuilddate=$( date "+%Y-%m-%d %H:%M:%S" )
   echo "本次build时间为 $newbuilddate"
   echo "本次build的编号 $newbuildnum"
   echo ""
   echo "本次build的改动："
   echo `git log --pretty=forma:" %an,   %s" --after="$builddate"`
   
   # Step 7 创建分支
   branchname="build_$newbuildnum"
   git checkout -b $branchname

   # Step 8 保存变化到文件
   echo "----------------------------------" >> "$changelogfile"
   echo  >> "$changelogfile"
   echo "$newbuilddate,   build $newbuildnum" >> "$changelogfile"
   echo >> "$changelogfile"
   echo `git log --pretty=format:" %an,   %s" --after="$builddate"` >> "$changelogfile"
   # At last update build data and build number
   echo $newbuilddate,$newbuildnum > "$buildnumberfile"

   # Step 9 提交
   git add buildnumber changelogs.txt
   git commit -m "build results on build $newbuildnum"
   # push
   git checkout master
   git merge $branchname
   # git push origin $branchname
   git push origin master
   git branch -D $branchname

   # Step 10
   # echo "请移步阿里云服务器，运行deploy.sh继续发布"
   # exit 0
    echo "构建壹建联成功！"
else
   echo "构建壹建联失败，请检查后再试！"
   # exit 1
fi

# Step 11 结束
endbuild=$( date "+%Y-%m-%d %H:%M:%S" )
echo "本次build开始时间：$startbuild"
echo "本次build结束时间：$endbuild"


