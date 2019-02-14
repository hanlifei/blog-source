---
title: Spring Boot项目中获取类or接口的所有实现
date: 2019-02-14 19:54:02
categories: 功能实现
tags:
  - java
  - Spring Boot
---

> 本文实现了在使用spring boot进行项目开发时, 开发环境和jar包环境下获取父类或者接口的所有子类

## 前言
java是没有提供直接的api获取某个类or接口的子类的, 所以需要自己进行实现

## 实现思路
+ 首先获取所有源码类
+ 其次结合反射获得bean
+ 最后判断是否是父类or接口的子类

那么实现这个功能需要有前提: **父类or接口的子类在同一个文件夹内, 因为如果是散乱分布的话, 在加上项目文件较多, 获取源码类的时候的搜索范围会很大**

## 实现

### 开发环境
环境: idea+maven+spring boot
maven项目运行spring boot项目时, 项目的class源文件是在target文件夹下的class文件夹中, class文件夹是一个独立的文件夹, 通过这点, 可以直接通过全路径查找路径下的源文件
```java
    private static ArrayList<Class> findClass(File file, String packagename) {
        ArrayList<Class> list = new ArrayList<>();
        if (!file.exists()) {
            log.debug("fileNoExists");
            return list;
        }
        File[] files = file.listFiles();
        for (File file2 : files) {
            if (file2.isDirectory()) {
                //添加断言用于判断
                assert !file2.getName().contains(".");
                ArrayList<Class> arrayList = findClass(file2, packagename + "." + file2.getName());
                list.addAll(arrayList);
            } else if (file2.getName().endsWith(".class")) {
                try {
                    //保存的类文件不需要后缀.class
                    list.add(Class.forName(packagename + '.' + file2.getName().substring(0,
                            file2.getName().length() - 6)));

                } catch (ClassNotFoundException e) {
                    e.printStackTrace();
                }
            }
        }
        return list;
    }
```
### jar包环境
当项目打成jar包后, 项目的class源文件存储在jar包内的BOOT-INF文件夹下的classes文件夹中, 该文件夹在jar中, 并不是一个独立的文件夹, 所以无法像开发环境那样直接通过路径进行获取, 需要借助JarFile这个工具类
```java
    private static ArrayList<Class> findClassByJar(String packageName, URL url) {
        ArrayList<Class> list = new ArrayList<>();
        String urlStr = url.toString();
        // 找到!/ 截断之前的字符串
        String jarPath = urlStr.substring(0, urlStr.indexOf("!/") + 2);
        try {
            log.debug("-------------jarPath" + jarPath);
            URL jarURL = new URL(jarPath);
            JarURLConnection jarCon = (JarURLConnection) jarURL.openConnection();
            JarFile jarFile = jarCon.getJarFile();
            Enumeration<JarEntry> jarEntrys = jarFile.entries();
            while (jarEntrys.hasMoreElements()) {
                JarEntry entry = jarEntrys.nextElement();
                // 简单的判断路径，如果想做到像Spring，Ant-Style格式的路径匹配需要用到正则。
                //获取到的className = BOOT-INF/classes/com/.../child.class
                String className = entry.getName();
                //去除className的前缀BOOT-INF/classes/
                if (!entry.isDirectory() && className.startsWith("BOOT-INF/classes/")) {
                    className = className.substring(17).replace('/', '.');
                } else {
                    continue;
                }
                log.debug("-------------entryName: " + className);
                if (className.startsWith(packageName)) {
                    //保存的类文件不需要后缀.class
                    list.add(Class.forName(className.substring(0, className.length() - 6)));
                }
                log.debug("-------------!entry.isDirectory()" + !entry.isDirectory());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }
```
### 封装使用
将上面两种针对不同环境的代码进行封装, 对外提供一个接口供使用
```java
	/**
     * @param parent 父类
	 *        packageName 子类包路径
     * @return 子类集合
     */
	public static List<Class> getChildrenClasses(Class parentClass, String packageName) {
        ArrayList<Class> list = new ArrayList<>();
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        String path = packageName.replace('.', '/');
        try {
            ArrayList<File> fileList = new ArrayList<>();
            /**
             * 这里面的路径使用的是相对路径
             * 另外，路径中切不可包含空格、特殊字符等！"../bin/"
             */
            Enumeration<URL> enumeration = classLoader.getResources(path);
            while (enumeration.hasMoreElements()) {
                URL url = enumeration.nextElement();
                log.debug("------------url: " + url.toString());
                if (url.toString().indexOf("jar!/") > 0) {
                    list.addAll(findClassByJar(packageName, url));
                } else {
                    list.addAll(findClass(new File(url.getFile()), packageName));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return list.stream()
                // 忽略接口类
                .filter(child -> !Modifier.isInterface(child.getModifiers()))
                // 忽略抽象类
                .filter(child -> !Modifier.isAbstract(child.getModifiers()))
                // 是否是子类
                .filter(child -> parentClass.isAssignableFrom(child))
                .collect(Collectors.toList());
    }
```
调用
```java
List<Class> children = ClassUtils.getAllClass(Parent.class, "com.child.packagename");
```