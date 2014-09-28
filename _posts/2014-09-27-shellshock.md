---
layout: post
title: My First Blog Post
---

For a long time I\'ve always wanted to blog. In fact, I started blogging a very long time ago, when I was in junior high school. I was only reminded of that [blog](http://michaelt59.blogspot.com) when I began recollecting when I first started blogging. From then when I was childish until now, I have not blogged. But during the last two years a few of my friends have re-inspired me to start blogging again. After many delays, here is my first blog post as an adult. It will be about the Shellshock bug that was publicized recently on the news. Many of my blog posts will be on technical subjects that I have an interest in, but I also hope to tell a few good stories and share some of my life experiences. Let\'s begin!

Instead of directly explaining what the Shellshock bug does, I prefer to show an example to show its effects first. I ran this command before updating bash on my laptop and ran it again after, and the screenshot below illustrates the difference.

{% highlight bash %}
env x='() { :;}; echo vulnerable' bash -c "hello"
{% endhighlight %}

<img src="{{ site.url }}/assets/screenshots/shellshock.png" alt="The before and after results of applying the bash update">

Without explanation, I think you can see the danger if you have familiarity with the shell. I regret that I did not try more commands before I patched bash on my computer, but I am very curious what would happen if some hacker replace

{% highlight bash %}
echo vulnerable
{% endhighlight %}

with

{% highlight bash %}
cd ~; rm -rf *
{% endhighlight %}

<span class="text-danger">Please do not try this.</span> Maybe I will try a similar command on my VM that is unpatched and provide an update, but of course I would not try to remove everything from my home directory ;p.

