#include<bits/stdc++.h>
using namespace std;

int main(){
	int t;
	cin>>t;
	cin.ignore();
	while(t--){
		string s;
		getline(cin,s);
		string ans;
		ans+=s[0];
		int i =1;
		int n = s.length();
		while(i+1<n){
			ans+=s[i];
			i+=2;
		}ans+=s[i];
		cout<<ans<<endl;
	}

}
