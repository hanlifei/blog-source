---
	title: 再问你Java内存模型…
---

> 本文原文来自网络, 此处只是摘要, 全文请移步
>
> 原创出处: [求你了，再问你Java内存模型的时候别再给我讲堆栈方法区了…](https://www.hollischuang.com/archives/3781)「Hollis」

## 起因

最近，面试过很多Java中高级开发，问过很多次关于Java内存模型的知识，问完之后，很多人上来就开始回答：

**~~Java内存模型由几部分组成，堆、本地方法栈、虚拟机栈、方法区…~~**

每一次我不想打断他们的话，虽然我知道这又是一个误会了我的问题的朋友。

<u>**其实，我想问的Java内存模型，是和并发编程有关的。而候选人给我回答的那叫JVM内存结构，完全是两回事。**</u>

很多时候，在我没有打断他们的情况下，一部分人慢慢的讲到了GC相关的知识。这种情况下，我只能硬着头皮继续问一些和JVM有关的知识。

但是，我的本意其实是想看一下他对Java并发有多少了解啊。

## 为什么会误解

首先，我们先来分析一下问什么很多人，甚至是大多数人会答非所问呢？

我觉得主要有几个原因：

1、Java内存模型，这个词听着太像是关于内存分布的知识了。听上去和并发编程没有半毛钱关系。

2、网上很多资料都是错的。不信你去网上搜索一下"Java内存模型"，你会发现，很多人打着内存模型的标题，介绍了JVM内存结构的知识。

3、还存在一种情况，虽然不多见，但是也有。那就是很多面试官自己也以为内存模型就是要介绍堆、栈、方法区这些知识。就导致有时候面试者不知道自己到底应该如何回答。

## 什么是内存模型(JMM)

Java内存模型是根据英文Java Memory Model（JMM）翻译过来的。其实JMM并不像JVM内存结构一样是真实存在的。他只是一个抽象的概念。

Java内存模型的相关知识在 JSR-133: Java Memory Model and Thread Specification 中描述的。JMM是和多线程相关的，他描述了一组规则或规范，这个规范定义了一个线程对共享变量的写入时对另一个线程是可见的。

**<u>Java内存模型（Java Memory Model ,JMM）就是一种符合内存模型规范的，屏蔽了各种硬件和操作系统的访问差异的，保证了Java程序在各种平台下对内存的访问都能得到一致效果的机制及规范。目的是解决由于多线程通过共享内存进行通信时，存在的原子性、可见性（缓存一致性）以及有序性问题。</u>**

为了保证共享内存的正确性（可见性、有序性、原子性），内存模型定义了共享内存系统中多线程程序读写操作行为的规范。通过这些规则来规范对内存的读写操作，从而保证指令执行的正确性。它与处理器有关、与缓存有关、与并发有关、与编译器也有关。他解决了CPU多级缓存、处理器优化、指令重排等导致的内存访问问题，保证了并发场景下的一致性、原子性和有序性。

Java内存模型规定了所有的变量都存储在主内存中，每条线程还有自己的工作内存，线程的工作内存中保存了该线程中是用到的变量的主内存副本拷贝，线程对变量的所有操作都必须在工作内存中进行，而不能直接读写主内存。不同的线程之间也无法直接访问对方工作内存中的变量，线程间变量的传递均需要自己的工作内存和主存之间进行数据同步进行。

而JMM就作用于工作内存和主存之间数据同步过程。他规定了如何做数据同步以及什么时候做数据同步。

## Java内存模型的实现

了解Java多线程的朋友都知道，在Java中提供了一系列和并发处理相关的关键字，比如volatile、synchronized、final、concurren包等。其实这些就是Java内存模型封装了底层的实现后提供给程序员使用的一些关键字。

在开发多线程的代码的时候，我们可以直接使用synchronized等关键字来控制并发，从来就不需要关心底层的编译器优化、缓存一致性等问题。所以，Java内存模型，除了定义了一套规范，还提供了一系列原语，封装了底层实现后，供开发者直接使用。

本文并不准备把所有的关键字逐一介绍其用法，因为关于各个关键字的用法，网上有很多资料。读者可以自行学习。本文还有一个重点要介绍的就是，我们前面提到，并发编程要解决原子性、有序性和一致性的问题，我们就再来看下，在Java中，分别使用什么方式来保证。

**原子性**

在Java中，为了保证原子性，提供了两个高级的字节码指令monitorenter和monitorexit。在synchronized的实现原理文章中，介绍过，这两个字节码，在Java中对应的关键字就是synchronized。

因此，在Java中可以使用synchronized来保证方法和代码块内的操作是原子性的。

**可见性**

Java内存模型是通过在变量修改后将新值同步回主内存，在变量读取前从主内存刷新变量值的这种依赖主内存作为传递媒介的方式来实现的。

Java中的volatile关键字提供了一个功能，那就是被其修饰的变量在被修改后可以立即同步到主内存，被其修饰的变量在每次是用之前都从主内存刷新。因此，可以使用volatile来保证多线程操作时变量的可见性。

除了volatile，Java中的synchronized和final两个关键字也可以实现可见性。只不过实现方式不同，这里不再展开了。

**有序性**

在Java中，可以使用synchronized和volatile来保证多线程之间操作的有序性。实现方式有所区别：

volatile关键字会禁止指令重排。synchronized关键字保证同一时刻只允许一条线程操作。

好了，这里简单的介绍完了Java并发编程中解决原子性、可见性以及有序性可以使用的关键字。读者可能发现了，好像synchronized关键字是万能的，他可以同时满足以上三种特性，这其实也是很多人滥用synchronized的原因。

但是synchronized是比较影响性能的，虽然编译器提供了很多锁优化技术，但是也不建议过度使用。

## 面试如何回答

见[原文](https://www.hollischuang.com/archives/3781)
