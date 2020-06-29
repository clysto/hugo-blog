---
title: "在 Spring Boot 中使用 MongoDB"
date: 2020-02-16T07:48:46.796Z
tags:
  - Spring Boot
  - Java
  - MongoDB

keywords: ['数据库', 'Java']
---

# 在 Spring Boot 中使用 MongoDB

![image.png](https://i.loli.net/2020/02/16/1DqolfaN3wRcYBi.png)

最近我把我的博客后端用 Spring Boot 重写了一遍，顺便体验了一波 Spring Boot 的开发。在 Spring Boot 中可以无缝的使用 Spring Data 来连接 MongoDB 数据库。

首先你需要 spring-boot-starter-data-mongodb 这个依赖，在 pom 文件中添加：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

如果你使用 Gradle 可以在 build.gradle 中添加：

```groovy
implementation 'org.springframework.boot:spring-boot-starter-data-mongodb'
```

<!--more-->

## 定义 Model

首先你需要定义一个 model，以一篇文章（Article）为例，我们在 model 包下新建 Article 类：

```java
package com.maoyachen.blogapi.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.Arrays;
import java.util.Date;

@Document(collection = "articles")
public class Article {
    @Id
    public String id;
    @Pattern(regexp = "\\w+(-\\w+)*")
    public String uri;
    @NotNull
    public String[] tags = new String[0];
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    public Date date = new Date();
    @NotEmpty
    public String description;
    @NotEmpty
    public String title;
    @NotEmpty
    public String content;
    @NotEmpty
    public String parsed;

    public String poster;
    public int likes;
    public boolean published = true;

    public Article() {
    }

    public Article(String uri, String[] tags, String description,
                   String title, String content, String parsed) {
        this.uri = uri;
        this.tags = tags;
        this.description = description;
        this.title = title;
        this.content = content;
        this.parsed = parsed;
    }

    @Override
    public String toString() {
        return "Article{" +
                "id='" + id + '\'' +
                ", content='" + content + '\'' +
                ", parsed='" + parsed + '\'' +
                ", poster='" + poster + '\'' +
                ", description='" + description + '\'' +
                ", title='" + title + '\'' +
                ", uri='" + uri + '\'' +
                ", tags=" + Arrays.toString(tags) +
                ", date=" + date +
                ", published=" + published +
                ", likes=" + likes +
                '}';
    }

    public String getCommentsUrl() {
        return "/comments/" + id;
    }

}
```

我们定义了一个空构造函数和一个包含 uri、tags、description、 title、content、parsed 属性的构造函数。Spring Data 给我们提供了一系列实用的注解，比如`@Id`注明了这个属性是一个 MongoID， 同时我们还可以结合 javax.validation.constraints 包下的注解来限制每个字段的格式，当我们在 controller 中使用`@Valid`注解时， Spring 就会按照每个字段的限制对实体进行格式的验证。

## 定义 Repository

下面我们需要定义一个 Repository， 我们在包 repository 下新建一个 ArticleRepository 接口， 注意这里我们只需定义接口， 具体的方法 Spring 会根据接口中的方法名字以及`@Query()`注解来自动实现。这里就是 Spring Boot 的优势。但是我们在定义方法的时候一定要遵守 Spring 的命名规则。

```java
package com.maoyachen.blogapi.repository;

import com.maoyachen.blogapi.model.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.stream.Stream;

public interface ArticleRepository extends MongoRepository<Article, String> {
    Article findArticleById(String id);

    @Query(value = "{}", fields = "{'content': 0, 'parsed': 0}")
    Page<Article> findAllArticles(Pageable pageable);

    @Query(value = "{}")
    Stream<Article> findAllArticlesAsStream();
}
```

比如以 find 开头的方法是根据条件查询，你可以使用**And**和**Or**来组合连接不同的字段。同时 Spring Data MongoDB 可以返回 Page 类型的分页数据，如果方法的类型是 Page\<T\>那么此方法需要接受 Pageable 参数来获取每页的大小以及请求的页码，以及如何对结果排序。

> 有关 Query 方法的创建可以参看[query-creation](https://docs.spring.io/spring-data/mongodb/docs/current/reference/html/#repositories.query-methods.query-creation)

同时你也可以使用`@Query()`注解来自定义查询结果，过滤掉某些字段等等。如果使用`Query()`注解依然不能满足一些特殊的查询，你还可以通过自动以 Repository 来实现更多的复杂操作。

## 自定义 Repository

首先在 repository 包中创建一个新的接口 ArticleRepositoryCustom，然后创建一个新的类 ArticleRepositoryImpl，这里的命名很重要：

> The most important part of the class name that corresponds to the fragment interface is the Impl postfix.

**如果你的接口名字是 xxx，那么你的类名就应该是 xxxImpl。**

```java
package com.maoyachen.blogapi.repository;

import com.maoyachen.blogapi.model.Article;

import java.util.Date;

public interface ArticleRepositoryCustom {
    Article findArticleByDateAndUri(Date date, String uri);
}
```

```java
package com.maoyachen.blogapi.repository;

import static org.springframework.data.mongodb.core.query.Criteria.where;

import com.maoyachen.blogapi.model.Article;
import com.mongodb.DBCursor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.function.Consumer;

@Repository
public class ArticleRepositoryImpl implements ArticleRepositoryCustom {
    private final MongoTemplate mongoTemplate;

    @Autowired
    public ArticleRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public Article findArticleByDateAndUri(Date date, String uri) {
        Query query = new Query(
                where("uri").is(uri).andOperator(where("date").gte(date), where("date").lt(nextDay(date)))
        );
        return mongoTemplate.findOne(query, Article.class);
    }

    private Date nextDay(Date date) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, 1);
        return calendar.getTime();
    }
}
```

在这个类里面你就可以使用 MongoTemplate 来实现更加复杂的查询或者操作。你可以使用`@Autowired`注解来注入 MongoTemplate 依赖。比如上面的`findArticleByDateAndUri`方法就是根据日期来返回指定的文章。

最后不要忘记在最开始的 ArticleRepository 中继承这个 CustomRepository：

```java
public interface ArticleRepository extends MongoRepository<Article, String>, ArticleRepositoryCustom{
    // ...
}
```

> 有关自定义 Repository 的使用可以参看 [custom-implementations](https://docs.spring.io/spring-data/mongodb/docs/current/reference/html/#repositories.custom-implementations)

## 在 Controller 中使用

当你定义好 你的 Repository 后你就可以讲其注入到你的 Controller 中了，还是使用`@Autowired`注解来注入。

```java
package com.maoyachen.blogapi.controller;

@RestController
@RequestMapping("/articles")
public class ArticlesController {

    private final ArticleRepository articleRepository;
    private final MarkdownService markdownService;

    @Autowired
    ArticlesController(ArticleRepository articleRepository, MarkdownService markdownService) {
        this.articleRepository = articleRepository;
        this.markdownService = markdownService;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public Page<Article> getAllArticles(
            @PageableDefault(size = 5)
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "date", direction = Sort.Direction.DESC)
            }) Pageable pageable) {
        return articleRepository.findAllArticles(pageable);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Article getArticleById(@PathVariable("id") String id) {
        Article article = articleRepository.findArticleById(id);
        if (article == null) {
            throw new ArticleNotFoundException();
        }
        return article;
    }
}
```

上面的 Controller 使用了我们定义好的 Repository 来提供 API 接口。

---

更多资料：[Spring Data MongoDB - Reference Documentation](https://docs.spring.io/spring-data/mongodb/docs/current/reference/html/)
