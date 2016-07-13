# Service Stat

Small app for loading data from services and output some simple statistics.

## Syntax

Every argument is operator like `{operator}={parameter}`.

### Supported services

* `github={uri}` - [GitHub](https://developer.github.com/v3/).
* `reddit={uri}` - [Reddit](https://www.reddit.com/dev/api/).

### Supported output formats

* `format=json` - [JSON](https://en.wikipedia.org/wiki/JSON)
* `format=csv` - [CSV](https://en.wikipedia.org/wiki/Comma-separated_values)
* `format=tsv` - [TSV](https://en.wikipedia.org/wiki/Tab-separated_values)
* `format=ssv` - [DSV](https://en.wikipedia.org/wiki/Delimiter-separated_values) with semicolon separator.
* `format=sql` - [SQL](https://en.wikipedia.org/wiki/SQL). You can specify name of table by `name={name}` operator before.

### Supported transformers

#### Sorting

`order={field}{orientation}` - sort by `field` with `orientation`.

Orientations: 

* `>` - greater to lower
* `<` - lower to greater. 

You can stack multiple fields: `sort=score>id<`.

#### Grouping

`group={field}` - group by `field`.

You can use projection with aggregation functions to get statistics: `group=domain project=domain,sum!score`.

#### Projection

`project={field1},{field2},...` - pick up some columns from source table.

You can use some functions to evaluate value: `group=author project=author,last!title`.

##### Functions

* `first!{field}` - `field` value of first row in group.
* `last!{field}` - `field` value of last row in group.
* `count!{field}` - count of distinct `field` values of rows in group.
* `sum!{field}` - sum of `field` values of rows in group.

### Slicing

`top={count}` - top `count` rows of table.

## Samples

Top 10 "jin" users on GitHub:

```
node . reddit=http://www.reddit.com/r/javascript/.json order=created_utc< group=domain project=domain,count!id,sum!score,last!author order=count!id>sum!score> name=domains_stat format=sql
```

```
91.7193 "jin"
26.150711       "jingle1267"
25.047386       "milooy"
25.047386       "jinchung"
24.929346       "jinthagerman"
23.631184       "jinpark"
21.813177       "ScorpiusJin"
21.156439       "zhoushanjinjie"
20.677286       "jinmingjian"
20.677286       "nin-jin"
```

Popular domains in "javascript" subreddit in SQL format:

```
node . reddit=http://www.reddit.com/r/javascript/.json group=domain project=domain,count!id,sum!score order=count!id>sum!score> name=domains_stat format=sql
```

```
INSERT INTO domains_stat (`domain`,`count!id`,`sum!score`) VALUES( "self.javascript",12,121 );
INSERT INTO domains_stat (`domain`,`count!id`,`sum!score`) VALUES( "github.com",2,70 );
INSERT INTO domains_stat (`domain`,`count!id`,`sum!score`) VALUES( "theodo.fr",1,164 );
INSERT INTO domains_stat (`domain`,`count!id`,`sum!score`) VALUES( "devbryce.com",1,36 );
INSERT INTO domains_stat (`domain`,`count!id`,`sum!score`) VALUES( "simonsmith.io",1,27 );
INSERT INTO domains_stat (`domain`,`count!id`,`sum!score`) VALUES( "medium.com",1,25 );
INSERT INTO domains_stat (`domain`,`count!id`,`sum!score`) VALUES( "twilio.com",1,21 );
INSERT INTO domains_stat (`domain`,`count!id`,`sum!score`) VALUES( "facebook.github.io",1,18 );
INSERT INTO domains_stat (`domain`,`count!id`,`sum!score`) VALUES( "technologyadvice.github.io",1,12 );
INSERT INTO domains_stat (`domain`,`count!id`,`sum!score`) VALUES( "blog.runnable.com",1,11 );
INSERT INTO domains_stat (`domain`,`count!id`,`sum!score`) VALUES( "goshakkk.name",1,7 );
INSERT INTO domains_stat (`domain`,`count!id`,`sum!score`) VALUES( "reddit.com",1,5 );
INSERT INTO domains_stat (`domain`,`count!id`,`sum!score`) VALUES( "philipwalton.com",1,4 );
INSERT INTO domains_stat (`domain`,`count!id`,`sum!score`) VALUES( "maxencec.github.io",1,3 );
```
