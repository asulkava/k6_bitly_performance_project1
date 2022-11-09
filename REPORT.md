# Project 1 report

Report for project 1 in course "Designing and Building Scalable Web Applications". I wanted to complete the project with merits so I made three bit.ly-like implementations.
The implementations were done with js + deno, js + node express and python + flask.

#### 1. Guidelines for running the applications
1. navigate to the folder of the implementation you want to run. For example: cd deno_implementation.
2. run docker-compose up (requires docker), now the project should be running. If there are some problems try to run docker-compose up --build

Implementation folders are:
deno_implementation
express_implementation
python_implementation

#### 2. Guidelines for running the applications
1. navigate to the k6 folder with cd k6
2. have the implementation you want to test running on the side
3. run your wanted test with k6 run testFile.js (requires k6)

Test files are:
mainPage.js - tests the main page
postForm.js - tests form submitting for deno and python
postFormExpress.js - tests form submitting for express
redirect.js - tests the redirect for deno and python
redirectExpress.js - tests redirect for express
random.js - tests the random location functionality (run postForm or redirect before to populate database)

The reason for separate tests for express with form and redirect,is that the express version was implemented a bit differently.

The redirect and random test will say DNS lookup failed for some addresses as they are randomly generated, but this should not matter to the test as it means that the redirect worked.

#### 3. Performance tests
The tests are ran with 10 concurrent users for 10 seconds.


The results have average requests per second and the median, 95th percentile, and 99th percentile HTTP request duration

##### Deno implementation #####

| Functionality | AVG req/s   | med duration (ms) | p(95) duration (ms)  | p(99) duration (ms) |
| -----------   | ----------- |------------------ | -------------------- | --------------------|           
| Main page     | 399 req/s   |       25.21       |          28.04       |       32.43         |
| Form submit   | 246 req/s   |       34.11       |          69.44       |       77.09         |
| Redirect      | 241 req/s   |       11.73       |          36.31       |       42.22         |
| Random        | 23  req/s   |       429.38      |         540.52       |      637.69         |

##### Express implementation #####

| Functionality | AVG req/s   | med duration (ms) | p(95) duration (ms)  | p(99) duration (ms) |
| -----------   | ----------- |------------------ | -------------------- | --------------------|           
| Main page     | 2201 req/s   |       4.31       |          5.96       |       7.43         |
| Form submit   | 1444 req/s   |       6.00       |          9.11       |       12.18         |
| Redirect      | 2030 req/s   |       4.80       |          5.99       |       7.0         |
| Random        | 159  req/s   |       60.52      |         79.77       |      109.23         |

##### Python implementation #####

| Functionality | AVG req/s   | med duration (ms) | p(95) duration (ms)  | p(99) duration (ms) |
| -----------   | ----------- |------------------ | -------------------- | --------------------|           
| Main page     | 887 req/s   |       10.99       |          12.01       |       13.0         |
| Form submit   | 606 req/s   |       16.7       |          26.0       |       29.28         |
| Redirect      | 225 req/s   |       18.0      |          22.99       |       25.0         |
| Random        | 253  req/s   |       38.0      |         49.99       |      58.32         |

#### 4. Reflection 
Looking at the different functionalities, we can see that the one with the most duration always is the random functionality, this is because of the implementation. The implementation queries all of the rows and picks one at random. As it queries every row, it is slow. The fastest implementation overall was the express implementation, this might because the framework is very lightweight and I'm the most comfortable with it. The python implementation might be faster than the deno implementation because of the way it communicaties with Postgre, Deno's postgre driver seems slower. 
The main page req/s are interesting as it does not query anything but just serves a static html file. Seems like express handles the serving of static files more efficiently.

#### 5. Improvement suggestions
One of the main possible improvements would be to implement some kind of caching, as the queries are the ones that take time. In addition, the database drivers and configurations should be optimized to suit the application. One clear improvement place is the SELECT queries, the select queries should be optimized somehow. The random query is very slow, it should be refactored to not query the whole database, and rather just select one randomly with ids or other ways. There are other options for databases as well which could be looked into.